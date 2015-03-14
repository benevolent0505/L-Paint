define(function() {
    var canvas = document.getElementById('canvas');

    return {
        getCanvas: function() {
            return canvas;
        },
        getContext: function() {
            return canvas.getContext('2d');
        }
    };
});
