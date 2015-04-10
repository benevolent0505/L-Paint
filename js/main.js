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
  var fill = require('./fill');
  var Media = require('./media');

  var draw = new Draw(canvas);
  var media = new Media();

  // UIオブジェクト
  var drawButton = document.getElementById('draw');
  var fillButton = document.getElementById('fill');
  var eraseButton = document.getElementById('erase');
  var clear = document.getElementById('clear');


  // 変数宣言
  var KEY = '59a484aa-de27-4986-b1f0-91d0a604f936';
  var destId;
  var dataConnection;

  var fillColor = '#000000';
  var fillFlag = false;

  // NodeListにforEachを付与するため
  var forEach = Array.prototype.forEach;


  // Peerオブジェクトの生成
  var peer = new Peer({key: KEY, debug: true});


  // Peer ID生成
  peer.on('open', function(id) {
    document.getElementById('my-id').textContent = id;
  });

  // Debug用途
  peer.listAllPeers(function(list) {
    list.forEach(function(p) {
      console.log(p);
    });
  });

  // canvasに対する操作
  // draw関係
  canvas.addEventListener('mousedown', function(e) {
    if (fillFlag) {
      fill.fillArea(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, fillColor);
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
    if (dataConnection) {
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


  // 相手からcallしてきたときの処理
  peer.on('call', function(call) {
    if (window.confirm(" is calling you. Do you answer the call ?")) {
      var destVideo = document.getElementById('dest-video');

      media.answer(call, destVideo);
    } else {
      media.close(call);
    }
  });


  // 向こうからのCanvansの更新
  peer.on('connection', function(connection) {
    dataConnection = connection;

    dataConnection.on('data', function(data) {
      // 描画
      console.log(data);
      if (data.type == 'clear') {
        draw.clear();
      }
      draw.drawByOther(data.type, data.x, data.y, data.color, data.width);
    });
    dataConnection.on('close', function() {
      console.log('close');
      alert('close');
      reset();
    });
  });


  // 自分のカメラのロード
  document.getElementById('load-media')
    .addEventListener('click', function(){
      navigator.getUserMedia({video: true, audio:false},
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

      // DataConnection 開始
      var connection = peer.connect(destId);
      connection.on('open', function() {
        dataConnection = connection;

        dataConnection.on('data', function(data) {
          // 描画
          console.log(data);
          if (data.type == 'clear') {
            draw.clear();
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
    draw.clear();
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

      draw.changeColor(color);
      fillColor = color;
    },false);
  });

  //線の太さを変える処理
  var sizes = document.getElementById('sizes').childNodes;
  forEach.call(sizes, function(node){
    node.addEventListener('click', function(e){
      var size = e.currentTarget.getAttribute('data-size');

      draw.changeLineWidth(size);
    }, false);
  });

  // Controls系
  drawButton.addEventListener('click', function() {
    fillFlag = false;
    draw.changeColor('#000000');
  }, false);
  fillButton.addEventListener('click', function(){
    fillFlag = fillFlag ? false : true;
  }, false);
  eraseButton.addEventListener('click', function() {
    fillFlag = false;
    draw.changeColor('#FFFFFF');
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
});
