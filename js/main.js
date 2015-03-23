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

    //線の色を変える処理
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

    //線の太さを変える処理
    var sizes = document.getElementById('sizes').childNodes;
    for (var i = 0, size; size = sizes[i]; i++){
        if (size.nodeName.toLowerCase() != 'div') continue;
        size.addEventListener('click', function(e){
            var size = e.currentTarget.getAttribute('data-size');
            context.lineWidth = size;
            draw.radius = size/2;
        }, false);
    };
});
