define(function(require) {
    'use strict';

    var init = require('init');

    // 初期化
    var canvas = init.getCanvas();
    var context = init.getContext();

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
                context.lineTo(evt.clientX-6, evt.clientY-6);
                context.stroke();

                context.beginPath();
                context.arc(evt.clientX-6, evt.clientY-6, this.radius, 0, 2 * Math.PI);
                context.fill();

                context.beginPath();
                context.moveTo(evt.clientX-6, evt.clientY-6);
            }
        },
        mouseUp: function() {
            this.drag = false;
            context.beginPath();
        },

    };
       

    var sizes= document.getElementById('sizes').childNodes;
    for (var i = 0, size; size = sizes[i]; i++){
        if (size.nodeName.toLowerCase() != 'div') continue;
        size.addEventListener('click', function(e){
            var size = e.currentTarget.getAttribute('data-size');
            context.lineWidth = size;
            radius = size;
        }, false);
    };
          

   return draw;
});
