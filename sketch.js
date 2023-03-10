p5.disableFriendlyErrors = true;

var overlay, zoomCenter, zoomSize, zoom, center, n, w, h, dx, dy, dd, p, p_, c, c_;

function setup() {
  n = 1024;
  w = windowWidth;
  h = windowHeight;
  dx = 4 / w;
  dy = 4 / h;
  dd = min(w, h);
  hdw = h / w;
  zoom = 1;
  center = createVector(0, 0);
  // p = 4;
  // p_ = 1 / p;
  c = 4;
  c_ = 1 / c;

  createCanvas(w, h);

  overlay = createGraphics(w, h);
  zoomCenter = createVector();
  zoomSize = createVector();

  fractal(0.5, center.x, center.y, zoom);
}

function draw() {
  updatePixels();
  image(overlay, 0, 0);

  // render();

  // noLoop();
}

function fractal(p, x, y, s) {
  let p_ = 1 / p;

  pixelDensity(p);
  background(0);

  loadPixels();
  for (j = 0; j < h; j += p_) {
    for (i = 0; i < w; i += p_) {
      col = 0;
      for (let d = 0; d < c; d++) {
        // cr = i * dx - 2 + random(dx * p_);
        // ci = j * dy - 2 + random(dy * p_);
        // zr = 0;
        // zi = 0;
        // zr = (i - w * 0.5) * dd + random(dd * p_);
        // zi = (j - h * 0.5) * dd + random(dd * p_);
        // zr = i / dd * zoom + 0 - 2;
        // zi = j / dd * zoom + 0 - 2;
        zr = map(i, 0, w, (x - 2 * s), (x + 2 * s)) / hdw + random(zoom / dd * p_);
        zi = map(j, 0, h, (y - 2 * s), (y + 2 * s)) + random(zoom / dd * p_);
        cr = -0.79;
        ci = 0.15;
        // cr = exp(-1);
        // ci = exp(-1);
        x2 = zr * zr;
        y2 = zi * zi;
        t = 0;

        while (x2 + y2 <= 64 && t < n) {
          zi = (zr + zr) * zi + ci;
          zr = x2 - y2 + cr;
          // zi = 2 * zr * zi + ci;
          // zr = x2 - y2 + cr;
          x2 = zr * zr;
          y2 = zi * zi;
          t++;
        }

        // m = sqrt(x2 + y2);
        // smooth_col = t - log(max(1, log(m))) / log(2);

        // col += smooth_col / n == 1 ? 0: smooth_col / n;
        // col += (smooth_col / n);

        col += t / n;

        // d = sqrt(x2 + y2);
        // col = log(log(d) / (log(2) * 2)) / log(2);
        // t = t + 1 - col;

        //         pixel = (i + 4 * j * w) * 16;

        //         t = (t % n) * 2;

        //         pixels[pixel + 0] = t;
        //         pixels[pixel + 1] = t;
        //         pixels[pixel + 2] = t;
        // pixels[pixel + 0] = zr * 64;
        // pixels[pixel + 1] = (d - 2) * 64;
        // pixels[pixel + 2] = (t * 16) % 256;
      }

      // t = (t % n) * 2;

      pixel = (i + j * w * p) * 4 * p;

      if (t != n) {
        pixels[pixel + 0] = pow(col * c_, 0.5) * 0;
        pixels[pixel + 1] = pow(col * c_, 0.5) * 192;
        pixels[pixel + 2] = pow(col * c_, 0.5) * 255;
      }

      // pixels[pixel + 0] = col * c_ % 1 * 255;
      // pixels[pixel + 1] = col * c_ % 1 * 255;
      // pixels[pixel + 2] = col * c_ % 1 * 255;
    }
  }
  updatePixels();


}

function mousePressed() {
  zoomCenter.set(mouseX, mouseY);
  zoomSize.set(0, 0);

  overlay.background(0, 128);
}

function mouseDragged() {
  zoomSize.add(mouseX - pmouseX, mouseY - pmouseY);

  overlay.clear();
  overlay.background(0, 128);
  overlay.erase();
  overlay.rectMode(CENTER)
  overlay.rect(zoomCenter.x, zoomCenter.y, zoomSize.x * 2, zoomSize.y * 2);
}

function mouseReleased() {
  // center.x = map(zoomCenter.x + zoomSize.x * 0.5, w, h, center.x - zoom,)
  center.x += map(zoomCenter.x, 0, w, -2 * zoom * dd / w, 2 * zoom * dd / w);
  center.y += map(zoomCenter.y, 0, h, -2 * zoom * dd / h, 2 * zoom * dd / h);

  zoom *= max(abs(zoomSize.x / w * 2), abs(zoomSize.y / h * 2));
  // zoom *= 0.5;

  fractal(0.5, center.x, center.y, zoom);

  overlay.clear();
}
