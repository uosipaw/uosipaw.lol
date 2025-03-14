window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

document.addEventListener("DOMContentLoaded", () => {
  // Detect touch device
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (!this.classList.contains("tapped")) {
          e.preventDefault();
          navLinks.forEach((l) => l.classList.remove("tapped"));
          this.classList.add("tapped");
        }
      });
    });
  }
});

// Initialize paint functionality if we're on the paint page
if (document.querySelector(".paint")) {
  // Paint is initialized via the self-executing function at the bottom of the script
  // Check if dat.GUI is available first
  if (typeof dat === "undefined") {
    console.error("dat.GUI library is required for the paint functionality");
  } else {
    initPaint();
  }
}

// Paint functionality
function initPaint() {
  // Function to generate a random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Apply the random color to the .paint class
  const paintElement = document.querySelector(".paint");
  if (paintElement) {
    paintElement.style.backgroundColor = getRandomColor();
  }
  const message = document.querySelector(".fade-message");

  function hideMessage() {
    if (message) {
      message.style.display = "none";
    }
  }

  // Define color palettes
  const palettes = [
    ["#FF5733", "#FFBD33", "#DBFF33", "#75FF33", "#33FF57"],
    ["#33FFBD", "#33DBFF", "#3375FF", "#5733FF", "#BD33FF"],
    ["#FF33DB", "#FF3375", "#FF5733", "#FFBD33", "#DBFF33"],
    // Add more palettes as needed
  ];

  // Function to get a random color from the palettes
  function randomColor() {
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  // Vars
  var canvas,
    context,
    centerX,
    centerY,
    mouseX = 0,
    mouseY = 0,
    isMouseDown = false,
    brush,
    gui,
    control,
    guiColorCtr,
    guiSizeCtr,
    guiIsRandColorCtr;

  // Event Listeners
  function resize(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width * 0.5;
    centerY = canvas.height * 0.5;
    context = canvas.getContext("2d");
    control.clear();
  }

  function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function mouseDown(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (control.isRandomColor) {
      brush.color = randomColor();
      guiColorCtr.updateDisplay();
    }
    if (control.isRandomSize) {
      brush.size = random(51, 5) | 0;
      guiSizeCtr.updateDisplay();
    }
    brush.startStroke(mouseX, mouseY);
    hideMessage();
  }

  function mouseUp(e) {
    brush.endStroke();
  }

  var touched = false;

  function touchMove(e) {
    var t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
  }

  function touchStart(e) {
    if (touched) return;
    touched = true;

    var t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
    if (control.isRandomColor) {
      brush.color = randomColor();
      guiColorCtr.updateDisplay();
    }
    if (control.isRandomSize) {
      brush.size = random(51, 5) | 0;
      guiSizeCtr.updateDisplay();
    }
    brush.startStroke(mouseX, mouseY);
    hideMessage();
  }

  function touchEnd(e) {
    touched = false;
    brush.endStroke();
  }

  // Helpers
  function random(max, min) {
    if (typeof max !== "number") {
      return Math.random();
    } else if (typeof min !== "number") {
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  // GUI Control
  control = {
    isRandomColor: true,
    isRandomSize: false,
    clear: function (e) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      brush.dispose();
    },
  };

  // Init
  canvas = document.getElementById("c");

  brush = new Brush(centerX, centerY, randomColor());

  window.addEventListener("resize", resize, false);
  resize(null);

  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mouseup", mouseUp, false);

  canvas.addEventListener("touchmove", touchMove, false);
  canvas.addEventListener("touchstart", touchStart, false);
  canvas.addEventListener("touchcancel", touchEnd, false);
  canvas.addEventListener("touchend", touchEnd, false);

  // GUI
  gui = new dat.GUI();
  guiColorCtr = gui
    .addColor(brush, "color")
    .name("Color")
    .onChange(function () {
      control.isRandomColor = false;
      guiIsRandColorCtr.updateDisplay();
    });
  guiSizeCtr = gui.add(brush, "size", 5, 50).name("Size");
  gui.add(brush, "inkAmount", 1, 30).name("Ink Amount");
  gui.add(brush, "splashing").name("Splashing");
  gui.add(brush, "dripping").name("Dripping");
  guiIsRandColorCtr = gui.add(control, "isRandomColor").name("Random Color");
  gui.add(control, "isRandomSize").name("Random Size");
  gui.add(control, "clear").name("Clear");
  gui.close();
}

// Start Update
var loop = function () {
  brush.render(context, mouseX, mouseY);
  requestAnimationFrame(loop);
};
loop();

/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Brush
 */
var Brush = (function () {
  /**
   * @constructor
   * @public
   */
  function Brush(x, y, color, size, inkAmount) {
    this.x = x || 0;
    this.y = y || 0;
    if (color !== undefined) this.color = color;
    if (size !== undefined) this.size = size;
    if (inkAmount !== undefined) this.inkAmount = inkAmount;

    this._drops = [];
    this._resetTip();
  }

  Brush.prototype = {
    _SPLASHING_BRUSH_SPEED: 75,

    x: 0,
    y: 0,
    color: "#000",
    size: 35,
    inkAmount: 7,
    splashing: true,
    dripping: true,
    _latestPos: null,
    _strokeId: null,
    _drops: null,

    isStroke: function () {
      return Boolean(this._strokeId);
    },

    startStroke: function () {
      if (this.isStroke()) return;

      this._resetTip();

      // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
      this._strokeId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r, v;
          r = (Math.random() * 16) | 0;
          v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    endStroke: function () {
      this._strokeId = this._latestPos = null;
    },

    render: function (ctx, x, y) {
      var isStroke = this.isStroke(),
        dx,
        dy,
        i,
        len;

      if (!this._latestPos) this._latestPos = {};
      this._latestPos.x = this.x;
      this._latestPos.y = this.y;
      this.x = x;
      this.y = y;

      if (this._drops.length) {
        var drops = this._drops,
          drop,
          sizeSq = this.size * this.size;

        for (i = 0, len = drops.length; i < len; i++) {
          drop = drops[i];

          dx = this.x - drop.x;
          dy = this.y - drop.y;

          if (
            (isStroke &&
              sizeSq > dx * dx + dy * dy &&
              this._strokeId !== drop.strokeId) ||
            drop.life <= 0
          ) {
            drops.splice(i, 1);
            len--;
            i--;
            continue;
          }

          drop.render(ctx);
        }
      }

      if (isStroke) {
        var tip = this._tip,
          strokeId = this._strokeId,
          dist;

        dx = this.x - this._latestPos.x;
        dy = this.y - this._latestPos.y;
        dist = Math.sqrt(dx * dx + dy * dy);

        if (this.splashing && dist > this._SPLASHING_BRUSH_SPEED) {
          var maxNum = ((dist - this._SPLASHING_BRUSH_SPEED) * 0.5) | 0,
            r,
            a,
            sr,
            sx,
            sy;

          ctx.save();
          ctx.fillStyle = this.color;
          ctx.beginPath();
          for (i = 0, len = (maxNum * Math.random()) | 0; i < len; i++) {
            r = (dist - 1) * Math.random() + 1;
            a = Math.PI * 2 * Math.random();
            sr = 5 * Math.random();
            sx = this.x + r * Math.sin(a);
            sy = this.y + r * Math.cos(a);
            ctx.moveTo(sx + sr, sy);
            ctx.arc(sx, sy, sr, 0, Math.PI * 2, false);
          }
          ctx.fill();
          ctx.restore();
        } else if (
          this.dripping &&
          dist < this.inkAmount * 2 &&
          Math.random() < 0.05
        ) {
          this._drops.push(
            new Drop(
              this.x,
              this.y,
              (this.size + this.inkAmount) *
                0.5 *
                ((0.25 - 0.1) * Math.random() + 0.1),
              this.color,
              this._strokeId
            )
          );
        }

        for (i = 0, len = tip.length; i < len; i++) {
          tip[i].render(ctx, dx, dy, dist);
        }
      }
    },

    dispose: function () {
      this._tip.length = this._drops.length = 0;
    },

    _resetTip: function () {
      var tip = (this._tip = []),
        rad = this.size * 0.5,
        x0,
        y0,
        a0,
        x1,
        y1,
        a1,
        cv,
        sv,
        i,
        len;

      a1 = Math.PI * 2 * Math.random();
      len = ((rad * rad * Math.PI) / this.inkAmount) | 0;
      if (len < 1) len = 1;

      for (i = 0; i < len; i++) {
        x0 = rad * Math.random();
        y0 = x0 * 0.5;
        a0 = Math.PI * 2 * Math.random();
        x1 = x0 * Math.sin(a0);
        y1 = y0 * Math.cos(a0);
        cv = Math.cos(a1);
        sv = Math.sin(a1);

        tip.push(
          new Hair(
            this.x + x1 * cv - y1 * sv,
            this.y + x1 * sv + y1 * cv,
            this.inkAmount,
            this.color
          )
        );
      }
    },
  };

  /**
   * Hair
   * @private
   */
  function Hair(x, y, inkAmount, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.inkAmount = inkAmount;
    this.color = color;

    this._latestPos = { x: this.x, y: this.y };
  }

  Hair.prototype = {
    x: 0,
    y: 0,
    inkAmount: 7,
    color: "#000",
    _latestPos: null,

    render: function (ctx, offsetX, offsetY, offsetLength) {
      this._latestPos.x = this.x;
      this._latestPos.y = this.y;
      this.x += offsetX;
      this.y += offsetY;

      var per = offsetLength ? this.inkAmount / offsetLength : 0;
      if (per > 1) per = 1;
      else if (per < 0) per = 0;

      ctx.save();
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.inkAmount * per;
      ctx.beginPath();
      ctx.moveTo(this._latestPos.x, this._latestPos.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    },
  };

  /**
   * Drop
   * @private
   */
  function Drop(x, y, size, color, strokeId) {
    this.x = x || 0;
    this.y = y || 0;
    this.size = size;
    this.color = color;
    this.strokeId = strokeId;

    this.life = this.size * 1.5;
    this._latestPos = { x: this.x, y: this.y };
  }

  Drop.prototype = {
    x: 0,
    y: 0,
    size: 7,
    color: "#000",
    strokeId: null,
    life: 0,
    _latestPos: null,
    _xOffRatio: 0,

    render: function (ctx) {
      if (Math.random() < 0.03) {
        this._xOffRatio += 0.06 * Math.random() - 0.03;
      } else if (Math.random() < 0.1) {
        this._xOffRatio *= 0.003;
      }

      this._latestPos.x = this.x;
      this._latestPos.y = this.y;
      this.x += this.life * this._xOffRatio;
      this.y += this.life * 0.1 * Math.random(); // Further reduced speed

      this.life -= (0.01 - 0.002) * Math.random() + 0.002; // Further reduced speed

      ctx.save();
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size + this.life * 0.3;
      ctx.beginPath();
      ctx.moveTo(this._latestPos.x, this._latestPos.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    },
  };

  return Brush;
})();

// Initialize

(function () {
  // Vars

  var canvas,
    context,
    centerX,
    centerY,
    mouseX = 0,
    mouseY = 0,
    isMouseDown = false,
    brush,
    gui,
    control,
    guiColorCtr,
    guiSizeCtr,
    guiIsRandColorCtr;

  // Event Listeners

  function resize(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width * 0.5;
    centerY = canvas.height * 0.5;
    context = canvas.getContext("2d");
    control.clear();
  }

  function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function mouseDown(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (control.isRandomColor) {
      brush.color = randomColor();
      guiColorCtr.updateDisplay();
    }
    if (control.isRandomSize) {
      brush.size = random(51, 5) | 0;
      guiSizeCtr.updateDisplay();
    }
    brush.startStroke(mouseX, mouseY);
  }

  function mouseUp(e) {
    brush.endStroke();
  }

  var touched = false;

  function touchMove(e) {
    var t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
  }

  function touchStart(e) {
    if (touched) return;
    touched = true;

    var t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
    if (control.isRandomColor) {
      brush.color = randomColor();
      guiColorCtr.updateDisplay();
    }
    if (control.isRandomSize) {
      brush.size = random(51, 5) | 0;
      guiSizeCtr.updateDisplay();
    }
    brush.startStroke(mouseX, mouseY);
  }

  function touchEnd(e) {
    touched = false;
    brush.endStroke();
  }

  // Helpers

  function randomColor() {
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function random(max, min) {
    if (typeof max !== "number") {
      return Math.random();
    } else if (typeof min !== "number") {
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  // GUI Control

  control = {
    isRandomColor: true,
    isRandomSize: false,
    clear: function (e) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      brush.dispose();
    },
  };

  // Init

  canvas = document.getElementById("c");

  brush = new Brush(centerX, centerY, randomColor());

  window.addEventListener("resize", resize, false);
  resize(null);

  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mouseup", mouseUp, false);

  canvas.addEventListener("touchmove", touchMove, false);
  canvas.addEventListener("touchstart", touchStart, false);
  canvas.addEventListener("touchcancel", touchEnd, false);
  canvas.addEventListener("touchend", touchEnd, false);

  // GUI

  gui = new dat.GUI();
  guiColorCtr = gui
    .addColor(brush, "color")
    .name("Color")
    .onChange(function () {
      control.isRandomColor = false;
      guiIsRandColorCtr.updateDisplay();
    });
  guiSizeCtr = gui.add(brush, "size", 5, 50).name("Size");
  gui.add(brush, "inkAmount", 1, 30).name("Ink Amount");
  gui.add(brush, "splashing").name("Splashing");
  gui.add(brush, "dripping").name("Dripping");
  guiIsRandColorCtr = gui.add(control, "isRandomColor").name("Random Color");
  gui.add(control, "isRandomSize").name("Random Size");
  gui.add(control, "clear").name("Clear");
  gui.close();
})();
