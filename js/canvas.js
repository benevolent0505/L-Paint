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
    console.log("draw");
    display.innerHTML = "draw";
});

document.getElementById('erase').addEventListener('click', function(){
    console.log("erase");
        display.innerHTML = "erase";
});

document.getElementById('fill').addEventListener('click', function(){
    console.log("fill");
        display.innerHTML = "fill";
});

document.getElementById('select-area').addEventListener('click', function(){
    console.log("select-area");
        display.innerHTML = "select area";
});

document.getElementById('copy').addEventListener('click', function(){
    console.log("copy");
    display.innerHTML = "copy";
});

document.getElementById('paste').addEventListener('click', function(){
    console.log("paste");
    display.innerHTML = "paste";
});

document.getElementById('load-image').addEventListener('click', function(){
    console.log("load-image");
    display.innerHTML = "load image";
});
