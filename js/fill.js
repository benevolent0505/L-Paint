define(function(require) {
  'use strict';

  var Seed = function(leftX, rightX, lineY, parentY) {
      this.leftX = leftX | 0;
      this.rightX = rightX | 0;
      this.lineY = lineY | 0;
      this.parentY = parentY | 0;
  };

  var Fill = function(canvas) {
    this.canvas = canvas,
    this.context = canvas.getContext('2d'),
    this.MAX_WIDTH = canvas.width,
    this.MAX_HEIGHT = canvas.height
  };

  Fill.prototype.fillArea = function(x, y, hex) {
    var buffer = [];
    var pickedColor = this.colorPicker(x, y);
    var paintColor = this.hex2RGB(hex);
    if (pickedColor == paintColor) {
      return;
    }

    buffer.push(new Seed(x, x, y, y));

    for (var i = 0; buffer[i]; i++) {
      var leftX = buffer[i].leftX;
      var rightX = buffer[i].rightX;
      var lineY = buffer[i].lineY;
      var parentY = buffer[i].parentY;

      var leftXSave = leftX - 1;
      var rightXSave = rightX + 1;

      // 塗りつぶし終わったシードは無視
      if (this.colorPicker(leftX, lineY) != pickedColor) {
        if (this.pickAlpha(leftX, lineY) == 255) {
          continue;
        }
      }

      // 右方向の境界を探す
      while (rightX < this.MAX_WIDTH) {
        if (this.colorPicker(rightX+1, lineY) != pickedColor) {
          if (this.pickAlpha(rightX+1, lineY) == 255) {
            break;
          }
        }
        rightX++;
      }

      // 左方向の境界を探す
      while(leftX > 0) {
        if (this.colorPicker(leftX-1, lineY) != pickedColor) {
          if (this.pickAlpha(leftX-1, lineY) == 255) {
            break;
          }
        }
        leftX--;
      }

      // シードを含んだ線分を描画
      for (var j = leftX; j <= rightX; j++) {
        this.pixelPaint(j, lineY, paintColor);
      }

      // 真上の線分を探索
      if (lineY - 1 >= 0) {
        if (lineY -1 == parentY) {
          buffer = buffer.concat(this.scanLine(
            leftX, leftXSave, lineY - 1, lineY, pickedColor));
          buffer = buffer.concat(this.scanLine(
            rightXSave, rightX, lineY - 1, lineY, pickedColor));
        } else {
          buffer = buffer.concat(this.scanLine(
            leftX, rightX, lineY - 1, lineY, pickedColor));
        }
      }

      // 真下の線分を探索
      if (lineY + 1 <= this.MAX_HEIGHT) {
        if (lineY + 1 == parentY) {
          buffer = buffer.concat(this.scanLine(
            leftX, leftXSave, lineY + 1, lineY, pickedColor));
          buffer = buffer.concat(this.scanLine(
            rightXSave, rightX, lineY + 1, lineY, pickedColor));
        } else {
          buffer = buffer.concat(this.scanLine(
            leftX, rightX, lineY + 1, lineY, pickedColor));
        }
      }
    }
  };

  Fill.prototype.scanLine = function(leftX, rightX, lineY, parentY, color) {
    var seeds = [];
    var alpha = 0;

    while (leftX <= rightX) {
      // 塗りつぶされた色は飛ばす
      for ( ; leftX < rightX; leftX++) {
        if (this.colorPicker(leftX, lineY) == color) {
          break;
        }
      }
      if (this.colorPicker(leftX, lineY) != color) {
        break;
      }

      var templx = leftX;

      // 塗りつぶす色も飛ばす
      for ( ; leftX <= rightX; leftX++) {
        if (this.colorPicker(leftX, lineY) != color) {
          break;
        }
      }

      // バッファへ
      seeds.push(new Seed(templx, leftX - 1, lineY, parentY));
    }

    return seeds;
  };

  Fill.prototype.pixelPaint = function(x, y, color) {
    var temp = this.context.fillStyle;

    this.context.fillStyle = color;
    this.context.fillRect(x, y, 1, 1);

    this.context.fillStyle = temp;
  };

  Fill.prototype.colorPicker = function(x, y) {
    if (x > this.MAX_WIDTH || x < 0 || y > this.MAX_HEIGHT || y < 0) {
      return 0;
    }
    var pixel = this.context.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgb = 'rgb(' + data[0] + ', ' + data[1] +
            ', ' + data[2] + ')';

    return rgb;
  };

  Fill.prototype.pickAlpha = function(x, y) {
    if (x > this.MAX_WIDTH || x < 0 || y > this.MAX_HEIGHT || y < 0) {
      return 0;
    }
    var pixel = this.context.getImageData(x, y, 1, 1);
    var alpha = pixel.data[3];

    return alpha;
  };

  Fill.prototype.hex2RGB = function(hex) {
    var r = parseInt(('0x' + hex.substring(1, 3)));
    var g = parseInt(('0x' + hex.substring(3, 5)));
    var b = parseInt(('0x' + hex.substring(5, 7)));

    var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';

    return rgb;
  };

  Fill.prototype.fillByOther = function(x, y, hex) {
    this.fillArea(x, y, hex);
  };

  return Fill;
});
