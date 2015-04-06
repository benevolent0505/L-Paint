define(function() {
  'use strict';


  // getUserMediaのベンダープレフィックス
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


  var Media = function (){
    this.callObject = '',
    this.localStream = ''
  };


  Media.prototype.loadStream = function(stream) {
    this.localStream = stream;
  };

  Media.prototype.call = function(peer, destId) {
    var call = peer.call(destId, this.localStream);

    if (this.callObject) {
      this.callObject.close();
    }
    this.callObject = call;
  };

  Media.prototype.answer = function(call, video) {
    call.answer(this.localStream);

    if (this.callObject) {
      this.callObject.close();
    }
    this.callObject = call;

    this.stream(video);
  };

  Media.prototype.stream = function(video) {
    this.callObject.on('stream', function(stream) {
      video.setAttribute('src', URL.createObjectURL(stream));
    });
    this.callObject.on('close', function() {
      console.log('DataConnection close');
    });
    this.callObject.on('error', function(err) {
      console.log(err);
    });
  };

  Media.prototype.close = function(call) {
    this.callObject = call || this.callObject;
    this.callObject.close();
  };


  return Media;
});
