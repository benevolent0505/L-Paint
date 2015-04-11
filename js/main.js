define(function(require) {
  // getUserMediaのベンダープレフィックス
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


  // 初期化
  var init = require('init');
  init.initBackGround();
  var canvas = init.getCanvas();
  var context = init.getContext();

  // require
  var Draw = require('./draw');
  var Fill = require('./fill');
  var Media = require('./media');

  var draw = new Draw(canvas);
  var fill = new Fill(canvas);
  var media = new Media();

  // UIオブジェクト
  var drawButton = document.getElementById('draw');
  var fillButton = document.getElementById('fill');
  var eraseButton = document.getElementById('erase');
  var clear = document.getElementById('clear');
  var getNameButton = document.getElementById('get-name');
  var modelControl = document.getElementById('model-control');


  // 変数宣言
  var KEY = '59a484aa-de27-4986-b1f0-91d0a604f936';
  var peer;
  var destId;
  var dataConnection;
  var myName;

  var fillColor = '#000000';
  var fillFlag = false;
  var eraseFlag = false;

  // NodeListにforEachを付与するため
  var forEach = Array.prototype.forEach;


  // Peerオブジェクトの生成
  //var peer = new Peer('mikio', {key: KEY, debug: true});


  // canvasに対する操作
  // draw関係
  canvas.addEventListener('mousedown', function(e) {
    if (fillFlag) {
      fill.fillArea(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, fillColor);
      if (dataConnection) {
        dataConnection.send({
          type: 'fill',
          x: e.clientX - canvas.offsetLeft,
          y: e.clientY - canvas.offsetTop,
          hex: fillColor
        });
      }
    } else {
      draw.mouseDown(e.clientX, e.clientY);
      // ここの条件が怪しい(各箇所)
      if (dataConnection) {
        dataConnection.send({
          type: 'down',
          x: e.clientX,
          y: e.clientY,
          color: context.strokeStyle,
          width: context.lineWidth
        });
      }
    }
  },false);
  canvas.addEventListener('mousemove', function(e) {
    draw.mouseMove(e.clientX, e.clientY);
    if (dataConnection && draw.drag) {
      dataConnection.send({
        type: 'move',
        x: e.clientX,
        y: e.clientY,
        color: context.strokeStyle,
        width: context.lineWidth
      });
    }
  });
  canvas.addEventListener('mouseup', function(e) {
    draw.mouseUp();
    if (dataConnection) {
      dataConnection.send({
        type: 'up',
        x: e.clientX,
        y: e.clientY,
        color: context.strokeStyle,
        width: context.lineWidth
      });
    }
  });
  canvas.addEventListener('mouseout', function(e) {
    draw.mouseOut();
    if (dataConnection) {
      dataConnection.send({
        type: 'out',
        x: e.clientX,
        y: e.clientY,
        color: context.strokeStyle,
        width: context.lineWidth
      });
    }
  }, false);


  // 自分のカメラのロード
  document.getElementById('load-media')
    .addEventListener('click', function(){
      navigator.getUserMedia({video: true, audio: true},
        function(stream) {
          media.loadStream(stream);
          document.getElementById('my-video').setAttribute('src', URL.createObjectURL(stream));
        },
        function(err) { console.log(err); });
    }, false);


  // 相手に通話するときの処理
  document.getElementById('call')
    .addEventListener('click', function() {
      var destId = document.getElementById('dest-id').value;
      var destVideo = document.getElementById('dest-video');

      media.call(peer, destId);
      media.stream(destVideo);
      document.getElementById('dest-name').textContent = destId;

      // DataConnection 開始
      var connection = peer.connect(destId);
      connection.on('open', function() {
        dataConnection = connection;

        dataConnection.on('data', function(data) {
          // 描画とか
          switch (data.type) {
            case 'clear':
              draw.clear(modelControl.style.background, modelControl.style.width);
            case 'fill':
              fill.fillByOther(data.x, data.y, data.hex);
          }
          draw.drawByOther(data.type, data.x, data.y, data.color, data.width);
        });
        dataConnection.on('close', function() {
          console.log('close');
          alert('close');
          reset();
        });
      });
      connection.on('error', function(err) { console.log(err); });
    }, false);


  // 相手と通話を終了するときの処理
  // canvasの接続も切る
  document.getElementById('end')
    .addEventListener('click', function() {
      media.close();

      reset();
    }, false);


  clear.addEventListener('click', function() {
    draw.clear(modelControl.style.background, modelControl.style.width);
    if (dataConnection) {
      dataConnection.send({type: 'clear'});
    }
  }, false);

  //線の色を変える処理
  var colors = document.getElementById('colors').childNodes;
  forEach.call(colors, function(node) {
    node.addEventListener('click', function (e) {
      var style = e.target.getAttribute('style');
      var color = style.match(/background:(#......)/)[1];

      if (!eraseFlag) {
        document.getElementById('model-control').style.background = color;

        draw.changeColor(color);
        fillColor = color;
      }
    },false);
  });

  //線の太さを変える処理
  var sizes = document.getElementById('sizes').childNodes;
  forEach.call(sizes, function(node){
    node.addEventListener('click', function(e){
      var size = e.currentTarget.getAttribute('data-size');

      if (!eraseFlag) {
        document.getElementById('model-control').style.width = size + 'px';
        document.getElementById('model-control').style.height = size + 'px';

        draw.changeLineWidth(size);
      }
    }, false);
  });

  // Controls系
  drawButton.addEventListener('click', function() {
    fillFlag = false;
    eraseFlag = false;
    var nowColor = document.getElementById('model-control').style.background;
    draw.changeColor(nowColor);
  }, false);
  fillButton.addEventListener('click', function(){
    fillFlag = fillFlag ? false : true;
  }, false);
  eraseButton.addEventListener('click', function() {
    fillFlag = false;
    eraseFlag = eraseFlag ? false : true;
    draw.changeLineWidth(10);
    draw.changeColor('#FFFFFF');
  }, false);
  getNameButton.addEventListener('click', function() {
    myName = document.getElementById('my-name').value;
    console.log(myName);
    if (myName) {
      peer = createPeer(myName);

      setTimeout(function() {
        if (peer.id) {

          var nameForm = document.getElementById('modal-content');
          nameForm.parentNode.removeChild(nameForm);
          var overlay = document.getElementById('modal-overlay');
          overlay.parentNode.removeChild(overlay);

          peerCall();
          peerConnection();

          document.getElementById('my-id').textContent = peer.id;

          navigator.getUserMedia({video: true, audio: true},
            function(stream) {
              media.loadStream(stream);
              document.getElementById('my-video').setAttribute('src', URL.createObjectURL(stream));
            },
            function(err) { console.log(err); });
        } else {
          document.getElementById('message').textContent = 'The name you have entered is not unique.';
          document.getElementById('message').style.display = 'block';
        }
      }, 500);
    } else {
      document.getElementById('message').textContent = 'Your name is empty!!!';
      document.getElementById('message').style.display = 'block';
    }
  }, false);


  // 選択中のボタンを目立たせる
  var controls = document.getElementById('control').children;
  forEach.call(controls, function(element) {
    element.firstChild.addEventListener('click', function(e) {
      forEach.call(controls, function(ele) {
        ele.classList.remove('pure-menu-selected');
      });

      element.classList.add('pure-menu-selected');
    }, false);
  });


  var reset = function() {
    peer.disconnect();
    dataConnection = '';
    destId = '';
  };

  var createPeer = function(id) {
    var p = new Peer(id, {key: KEY, debug: true});

    return p;
  };

  var peerCall = function() {
    peer.on('call', function(call) {
      if (window.confirm(call.peer + ' is calling you. Do you answer the call?')) {
        var destVideo = document.getElementById('dest-video');
        document.getElementById('dest-name').textContent = call.peer;

        media.answer(call, destVideo);
      } else {
        media.close(call);
      }
    });
  };

  var peerConnection = function() {
    peer.on('connection', function(connection) {
      dataConnection = connection;

      dataConnection.on('data', function(data) {
        // 描画とか
        switch (data.type) {
          case 'clear':
            draw.clear(modelControl.style.background, modelControl.style.width);
          case 'fill':
            fill.fillByOther(data.x, data.y, data.hex);
        }
        draw.drawByOther(data.type, data.x, data.y, data.color, data.width);
      });
      dataConnection.on('close', function() {
        console.log('close');
        alert('close');
        reset();
      });
    });
  };
});
