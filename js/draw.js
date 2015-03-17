define(function(require) {
    'use strict';

    var canvas = init.getCanvas();
    var context = init.getContext();

    context.fillStyle = 'rgb(0, 0, 0)';
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.lineWidth = 10;

    var draw = {
        drag: false,
        radius: 5,

        mouseDown: function() {
            this.drag = true;
        },
        mouseMove: function(evt) {
            if (this.drag) {
                context.lineTo(evt.clientX, evt.clientY);
                context.stroke();

                context.beginPath();
                context.arc(evt.clientX, evt.clientY, this.radius, 0, 2 * Math.PI);
                context.fill();

                context.beginPath();
                context.moveTo(evt.clientX, evt.clientY);
            }
        },
        mouseUp: function() {
            this.drag = false;
            context.beginPath();
        }
    };

    return draw;
});
