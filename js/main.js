define(function(require) {
    // 初期化
    var init = require('init');
    init.initBackGround();

    var canvas = init.getCanvas();
    var context = init.getContext();

    var draw = require('./draw');
    var fill = require('./fill');
    var video = require('./video');


    // UIオブジェクト
    var fillButton = document.getElementById('fill');


    var fillColor = '#000000';
    var fillFlag = false;


    // NodeListにforEachを付与するため
    var forEach = Array.prototype.forEach;


    // canvasに対する操作
    // draw関係
    canvas.addEventListener('mousedown', function(e) {
        if(fillFlag){
            fill.fillArea(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, fillColor);
        }else{
        draw.mouseDown();
        }
    },false);
    canvas.addEventListener('mousemove', function(e) {
        draw.mouseMove(e);
    });
    canvas.addEventListener('mouseup', function() {
        draw.mouseUp();
    });

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
