define(function(require) {
    'use strict';
    
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    context.fillStyle = '#000000';
    context.strokeStyle = '#000000';
    
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
    
    return colors;
});
