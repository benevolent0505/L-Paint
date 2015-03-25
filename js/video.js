define(function(require) {
    'use strict';

    window.navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    var video = document.getElementById('chat');
    var localStream = null;

    navigator.getUserMedia({video: true, audio: false},
        function(stream) {
            console.log(stream);
            video.src = window.URL.createObjectURL(stream);
        },
        function(err) {
            console.log(err);
        }
    );
});
