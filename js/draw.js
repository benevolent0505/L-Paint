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
    this.lock = false,
    this.context.fillStyle = '#000000',
    this.context.strokeStyle = '#000000',
    this.context.lineWidth = 10,
    this.context.lineCap = 'round'
  };

  Draw.prototype.clear = function() {
    this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
    this.context.fillRect(0, 0, this.width, this.height);
    this.drag = false;
    this.lock = false;
    this.context.fillStyle = '#000000';
    this.context.strokeStyle = '#000000';
    this.context.lineWidth = 10;
    this.context.lineCap = 'round';
  };

  Draw.prototype.mouseDown = function(x, y) {
    if (!this.lock) {
      this.drag = true;
      this.startX = x - this.offsetLeft;
      this.startY = y - this.offsetTop;
    }
  };

  Draw.prototype.mouseMove = function(x, y) {
    if (this.drag && !this.lock) {
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
    if (this.drag && !this.lock) {
      this.drag = false;
    }
  };

  Draw.prototype.mouseOut = function() {
    this.drag = false;
  };

  Draw.prototype.changeLineWidth = function(width) {
    this.context.lineWidth = width;
  };

  Draw.prototype.changeColor = function(color) {
    this.context.fillStyle = color;
    this.context.strokeStyle = color;
  };

  Draw.prototype.drawByOther = function(type, x, y, color, width) {
    var tmpColor = this.context.fillStyle;
    var tmpWidth = this.context.lineWidth;

    this.context.fillStyle = color;
    this.context.strokeStyle = color;
    this.context.lineWidth = width;

    switch (type) {
      case 'down':
        this.lock = true;
        this.startX = x - this.offsetLeft;
        this.startY = y - this.offsetTop;
        break;
      case 'move':
        if (this.lock) {
          this.endX = x - this.offsetLeft;
          this.endY = y - this.offsetTop;

          this.context.beginPath();
          this.context.moveTo(this.startX, this.startY);
          this.context.lineTo(this.endX, this.endY);
          this.context.stroke();

          this.startX = this.endX;
          this.startY = this.endY;
        }
        break;
      case 'up':
        if (this.lock) {
          this.lock = false;
        }
        break;
      case 'out':
        this.lock = false;
        break;
    }

    this.context.fillStyle = tmpColor;
    this.context.strokeStyle = tmpColor;
    this.context.lineWidth = tmpWidth;
  };

  return Draw;
});
