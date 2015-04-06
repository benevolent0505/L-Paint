define(function(require) {
    'use strict';

    var init = require('init');

    // 初期化
    var canvas = init.getCanvas();
    var context = init.getContext();

    var offsetTop = canvas.offsetTop;
    var offsetLeft = canvas.offsetLeft;

    // 線の太さと色の初期化
    context.fillStyle = '#000000';
    context.strokeStyle = '#000000';
    context.lineWidth = 10;

    // drawモジュール作成
    var draw = {
        drag: false,
        radius: 5,

        mouseDown: function() {
            this.drag = true;
        },
        mouseMove: function(evt) {
            if (this.drag) {
                context.lineTo(evt.clientX-offsetLeft, evt.clientY-offsetTop);
                context.stroke();

                context.beginPath();
                context.arc(evt.clientX-offsetLeft, evt.clientY-offsetTop, this.radius, 0, 2 * Math.PI);
                context.fill();

                context.beginPath();
                context.moveTo(evt.clientX-offsetLeft, evt.clientY-offsetTop);
            }
        },
        mouseUp: function() {
            this.drag = false;
            context.beginPath();
        },
        changeColor: function(color){
            context.fillStyle   = color;
            context.strokeStyle = color;
        },
        changeLineWidth: function(width){
            this.radius = width / 2;
            context.lineWidth = width;
        },
        drawByOther: function(x, y, color, mode) {
          var tmpColor = context.fillStyle;

          context.fillStyle = color;
          context.strokeStyle = color;

          switch (mode) {
            case 'down':
              this.drag = true;
              break;
            case 'move':
              if (this.drag) {
                context.lineTo(x-offsetLeft, y-offsetTop);
                context.stroke();

                context.beginPath();
                context.arc(x-offsetLeft, y-offsetTop, this.radius, 0, 2 * Math.PI);
                context.fill();

                context.beginPath();
                context.moveTo(x-offsetLeft, y-offsetTop);
              }

              break;
            case 'up':
              this.drag = false;
              context.beginPath();
              break;
          }

          context.fillStyle = tmpColor;
          context.strokeStyle = tmpColor;
        }
    };

   return draw;
});
