define(function(require) {
    var init = require('init');

    var draw = require('./draw');
    var fill = require('./fill');
    var selectArea = require('./selectArea');
    var copy = require('./copy');
    var paste = require('./paste');
    var loadImage = require('./loadImage');
    var colors = document.getElementById('colors').childNodes;
    for (var i = 0, color; color = colors[i]; i++) {
        if (color.nodeName.toLowerCase() != 'div') continue;
        color.addEventListener('click', function (e) {
            var style = e.target.getAttribute('style');
            var color = style.match(/background:(#......)/)[1];
            context.strokeStyle = color;
            context.fillStyle = color;
        },false);
    };


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
