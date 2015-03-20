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

    document.getElementById('draw').addEventListener('click', function(){
    });
    document.getElementById('erase').addEventListener('click', function(){

    });
    document.getElementById('fill').addEventListener('click', function(){
        fill.call();
    });
    document.getElementById('select-area').addEventListener('click', function(){
        selectArea.call();
    });
    document.getElementById('copy').addEventListener('click', function(){
        copy.call();
    });
    document.getElementById('paste').addEventListener('click', function(){
        paste.call();
    });
    document.getElementById('load-image').addEventListener('click', function(){
        loadImage.call();
    });
});
