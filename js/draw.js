define(function(require) {
  'use strict';

  var Draw = function(canvas) {
    this.canvas = canvas,
    this.context = canvas.getContext('2d'),
    this.width = canvas.width,
    this.height = canvas.height,
    this.offsetTop = canvas.offsetTop,
    this.offsetLeft = canvas.offsetLeft,
    this.drag = false,
    this.radius = 5,
    this.context.fillStyle = '#000000',
    this.context.strokeStyle = '#000000',
    this.context.lineWidth = this.radius * 2
  };

  Draw.prototype.clear = function() {
    this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
    this.context.fillRect(0, 0, this.width, this.height);
    this.drag = false;
    this.radiis = 5;
    this.context.fillStyle = '#000000';
    this.context.strokeStyle = '#000000';
    this.context.lineWidth = this.radius * 2;
  };

  Draw.prototype.mouseDown = function(x, y) {
    this.drag = true;
    this.startX = x - this.offsetLeft;
    this.startY = y - this.offsetTop;
  };

  Draw.prototype.mouseMove = function(x, y) {
    if (this.drag) {
      this.endX = x - this.offsetLeft;
      this.endY = y - this.offsetTop;

      this.context.beginPath();
      this.context.lineCap = 'round';
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(this.endX, this.endY);
      this.context.stroke();

      this.startX = this.endX;
      this.startY = this.endY;
    }
  };

  Draw.prototype.mouseUp = function() {
    if (this.drag) {
      this.drag = false;
    }
  };

  Draw.prototype.mouseOut = function() {
    this.drag = false;
  };

  Draw.prototype.erase = function(x, y) {};

  Draw.prototype.drawOther = function(type, x, y) {
    switch (type) {
      case 'down':
        this.mouseDown();
        break;
      case 'move':
        this.mouseMove(x ,y);
        break;
      case 'up':
        this.mouseUp();
        break;
      case 'out':
        this.mouseOut();
        break;
    }
  };

  return Draw;
});
