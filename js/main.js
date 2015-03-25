define(function(require) {
    var init = require('init');

    var draw = require('./draw');
    var fill = require('./fill');
    var selectArea = require('./selectArea');
    var copy = require('./copy');
    var paste = require('./paste');
    var loadImage = require('./loadImage');

    var canvas = init.getCanvas();
    var context = init.getContext();

    // canvasに対する操作
    // draw関係
    canvas.addEventListener('mousedown', function() {
        draw.mouseDown();
    });
    canvas.addEventListener('mousemove', function(e) {
        draw.mouseMove(e);
    });
    canvas.addEventListener('mouseup', function() {
        draw.mouseUp();
    });

   
    var forEach = Array.prototype.forEach;

    //線の色を変える処理
    var colors = document.getElementById('colors').childNodes;
    forEach.call(colors, function(node) {
        node.addEventListener('click', function (e) {
            var style = e.target.getAttribute('style');
            var color = style.match(/background:(#......)/)[1];
            draw.changeColor(color);
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
});
