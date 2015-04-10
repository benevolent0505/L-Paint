define(function(require) {
    // getUserMediaのベンダープレフィックス
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


    // 初期化
    var init = require('init');
    init.initBackGround();

    var canvas = init.getCanvas();
    var context = init.getContext();


    // require
    var draw = require('./draw');
    var fill = require('./fill');
    var Media = require('./media');
    var media = new Media();

    // UIオブジェクト
    var fillButton = document.getElementById('fill');


    // 変数宣言
    var KEY = '59a484aa-de27-4986-b1f0-91d0a604f936';
    var destId;
    var dataConnection;
    var fillColor = '#000000';
    var fillFlag = false;


    // NodeListにforEachを付与するため
    var forEach = Array.prototype.forEach;


    // Peerオブジェクトの生成
    var peer = new Peer({key: '59a484aa-de27-4986-b1f0-91d0a604f936', debug: true});


    // Peer ID生成
    peer.on('open', function(id) {
      document.getElementById('my-id').textContent = id;
    });


    // canvasに対する操作
    // draw関係
    canvas.addEventListener('mousedown', function(e) {
        if(fillFlag){
            fill.fillArea(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, fillColor);
        }else{
          draw.mouseDown();
          dataConnection.send({
            act: 'down',
            x: e.clientX,
            y: e.clientY,
            color: context.strokeStyle
          });
        }
    },false);
    canvas.addEventListener('mousemove', function(e) {
        draw.mouseMove(e);
        dataConnection.send({
            act: "move",
            x: e.clientX,
            y: e.clientY,
            color: context.strokeStyle
        });
    });
    canvas.addEventListener('mouseup', function(e) {
        draw.mouseUp();
        dataConnection.send({
            act: "up",
            x: e.clientX,
            y: e.clientY,
            color: context.strokeStyle
        });
    });


    // 相手からcallしてきたときの処理
    peer.on('call', function(call) {
      if (window.confirm("Someone is calling you. Do you answer the call ?")) {
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
        draw.drawByOther(data.x, data.y, data.color, data.act);
      });
      dataConnection.on('close', function() { console.log('close'); });
    });


    // 自分のカメラのロード
    // loadを始めるボタンか何かが必要
    // audioだけかvideoだけか両方か両方ダメかを選択できるようにしないといけない
    document.getElementById('load-media')
      .addEventListener('click', function(){
        navigator.getUserMedia({video: true, audio:false}, function(stream) {
          media.loadStream(stream);
          document.getElementById('my-video').setAttribute('src', URL.createObjectURL(stream));
        }, function(err) { console.log(err); });
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
          draw.drawByOther(data.x, data.y, data.color, data.act);
        });
        dataConnection.on('close', function() { console.log('close'); });
      });
      connection.on('error', function(err) { console.log(err); });
      }, false);


    // 相手と通話を終了するときの処理
    // canvasの接続も切る
    document.getElementById('end')
      .addEventListener('click', function() {
        media.close();
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

    // 塗りつぶしの切替
    fillButton.addEventListener('click', function(){
        if(fillFlag){
            fillFlag = false;
        } else{
            fillFlag = true;
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
});
