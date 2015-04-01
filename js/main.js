define(function(require) {
    var init = require('init');
    init.initBackGround();

    var draw = require('./draw');
    var fill = require('./fill');

    var selectArea = require('./selectArea');
    var copy = require('./copy');
    var paste = require('./paste');
    var loadImage = require('./loadImage');

    var video = require('./video');

    var canvas = init.getCanvas();
    var context = init.getContext();

    var fillButton = document.getElementById('fill');

    var fillColor = '#000000';
    var fillFlag = false;

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

    var forEach = Array.prototype.forEach;

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

    fillButton.addEventListener('click', function(){
        if(fillFlag){
            fillFlag = false;
        } else{
            fillFlag = true;
        }
    }, false);
});
