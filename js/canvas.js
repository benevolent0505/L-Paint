var LPaint = {
    init: function() {
    },

    paint: {
        draw: function() {
            console.log("draw");
            display.innerHTML = "draw";
        },

        erase: function() {
            console.log("erase");
            display.innerHTML = "erase";
        },

        fill: function() {
            console.log("fill");
            display.innerHTML = "fill";
        },

        selectArea: function() {
            console.log("select-area");
            display.innerHTML = "select area";
        },

        copy: function() {
            console.log("copy");
            display.innerHTML = "copy";
        },

        paste: function() {
            console.log("paste");
            display.innerHTML = "paste";
        },

        loadImage: function() {
            console.log("load-image");
            display.innerHTML = "load image";
        }
    }
};

var onload_function = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var display = document.getElementById('display');

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
        LPaint.paint.draw();
    });
    document.getElementById('erase').addEventListener('click', function(){
        LPaint.paint.erase();
    });
    document.getElementById('fill').addEventListener('click', function(){
        LPaint.paint.fill();
    });
    document.getElementById('select-area').addEventListener('click', function(){
        LPaint.paint.selectArea();
    });
    document.getElementById('copy').addEventListener('click', function(){
        LPaint.paint.copy();
    });
    document.getElementById('paste').addEventListener('click', function(){
        LPaint.paint.paste();
    });
    document.getElementById('load-image').addEventListener('click', function(){
        LPaint.paint.loadImage();
    });
};

document.addEventListener('DOMContentLoaded', onload_function, false);
