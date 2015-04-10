define(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    return {
        initBackGround: function(){
            context.fillStyle = 'rgba(255, 255, 255, 1.0)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#000000';
        },
        getCanvas: function() {
            return canvas;
        },
        getContext: function() {
            return context;
        }
    };
});
