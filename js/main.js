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

    var radius = 4;
    var drag = false;

    context.lineWidth = 2 * radius;

    context.fillStyle = 'rgb(0, 0, 0)';
    context.strokeStyle = 'rgb(0, 0, 0)';

    canvas.addEventListener('mousedown', function(e) {
        drag = true;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (drag) {
            context.lineTo(e.clientX, e.clientY);
            context.stroke();

            context.beginPath();
            context.arc(e.clientX, e.clientY, radius, 0, 2 * Math.PI);
            context.fill();

            context.beginPath();
            context.moveTo(e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        drag = false;
        context.beginPath();
    });

    document.getElementById('draw').addEventListener('click', function(){
        draw.call();
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
