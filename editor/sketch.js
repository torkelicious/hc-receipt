// RECEIPT!
// This is the file to edit. p5.js reference: https://p5js.org/reference/
import JsBarcode from "jsbarcode";

export const receipt = {
  height: 1080, // 240–2000 px. Width is fixed by the printer.
  seed: 67,
};

// everything here is editable. play around or rm -rf and see what you come up with!
export function drawReceipt(p) {
  const { width: w, height: h } = p;
  const margin = 24;

  // Header
  /*   p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.BOLD);
  p.textSize(28);
  p.text(":", w / 2, 30);
 */
  dashedLine(p, margin, 94, w - margin, 94, 6, 5);

  //
  // raah
  //

  nodeWeb(p, -0, 620, 420, 920);
  funkyWeb(p, 0, 900, 500, 100);

  // gordon
  p.loadImage("assets/whatsapp.jpeg", (image) => {
    const maxWidth = w - margin * 2;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);

    const imageWidth = image.width * scale;
    const imageHeight = image.height * scale;

    dither(image);

    p.image(image, (w - imageWidth) / 2, 110, imageWidth, imageHeight);
  });

  // symbols
  symbol(p, w / 2, 550, 115);

  dashedLine(p, margin, 930, w - margin, 930, 6, 5);

  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.NORMAL);
  p.textSize(14);
  p.text("SUBJECT FREEMAN:\nLAST SEEN: �̶̯̯̤͐̀�̸͎͇̋︎̵̖̍́͆̕●̶̨̗͎͐͐͝︎̶͖͌̌♋̴͔̖̆̎︎̶̫̅̄̇♍̴̥̍̓͂͜︎̷̘͆͌̆̐�̷̪̖͕̝́͌̓�̶̡̬̅ͅ ̷̤̠͇͂͘☹̸̟͎̺͊̄̆̓︎̵̢̱̃͒̑□̶̯̯͒͗︎̵̛̠̦͂̒͝♎̶̲̗̥̎́͗︎̶̛̩̀̕♑̸̜͍̉̅̀︎̵̧̜́̾̔ͅ♏̴̮̍ͅ︎̵̢͈̤͍̉́͒", w / 2, 630);

  p.textSize(11);
  p.text("Forwarded many times", w / 2, 909);

  drawWarp(p, 650, 241);

  //
  // raah 2
  //

  const barcodeValue = "non est";
  drawBarcode(p, barcodeValue, w / 2, 960);

  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.NORMAL);
  p.textSize(10);
  p.text(barcodeValue, w / 2, 1024);
}

function symbol(p, x, y, size) {
  const s = size / 2;

  p.push();
  p.translate(x, y);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(5);
  p.strokeCap(p.PROJECT);
  p.strokeJoin(p.MITER);

  // diamond
  p.beginShape();
  p.vertex(0, -s);
  p.vertex(s, 0);
  p.vertex(0, s);
  p.vertex(-s, 0);
  p.endShape(p.CLOSE);

  // left
  p.beginShape();
  p.vertex(-2 * s, 0);
  p.vertex(-s, -s);
  p.vertex(-s / 2, -s / 2);
  p.endShape();

  // right
  p.beginShape();
  p.vertex(s / 2, -s / 2);
  p.vertex(s, -s);
  p.vertex(2 * s, 0);
  p.endShape();

  p.pop();
}

function drawBarcode(p, value, centerX, y) {
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, value, {
    format: "CODE128",
    width: 1,
    height: 52,
    displayValue: false,
    margin: 0,
    background: "#ffffff",
    lineColor: "#000000",
  });
  // Draw directly on p5's canvas: p.image expects a p5 image wrapper, while
  // JsBarcode returns a regular browser canvas.
  p.drawingContext.drawImage(
    barcodeCanvas,
    Math.floor(centerX - barcodeCanvas.width / 2),
    y,
  );
}

function dashedLine(p, x1, y1, x2, y2, dash, gap) {
  p.push();
  p.stroke(0);
  p.strokeWeight(2);

  for (let x = x1; x < x2; x += dash + gap) {
    p.line(x, y1, Math.min(x + dash, x2), y2);
  }

  p.pop();
}

function dither(img) {
  img.loadPixels();

  const contrast = 1.3;
  const brightness = 15;

  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];

    // luminosity
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    gray = ((gray / 255 - 0.5) * contrast + 0.5) * 255 + brightness;

    // clamp
    gray = Math.max(0, Math.min(255, gray));

    img.pixels[i] = img.pixels[i + 1] = img.pixels[i + 2] = gray;
  }

  // floyd-steinberg
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let oldPixel = img.pixels[index];

      let newPixel = oldPixel < 128 ? 0 : 255;

      img.pixels[index] = newPixel;
      img.pixels[index + 1] = newPixel;
      img.pixels[index + 2] = newPixel;

      let err = oldPixel - newPixel;

      let addErr = (dx, dy, factor) => {
        let nx = x + dx;
        let ny = y + dy;
        if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
          let nIndex = (nx + ny * img.width) * 4;
          let val = img.pixels[nIndex] + err * factor;

          img.pixels[nIndex] =
            img.pixels[nIndex + 1] =
            img.pixels[nIndex + 2] =
              val;
        }
      };

      addErr(1, 0, 7 / 16);
      addErr(-1, 1, 3 / 16);
      addErr(0, 1, 5 / 16);
      addErr(1, 1, 1 / 16);
    }
  }
  img.updatePixels();
}

function drawWarp(p, startY, h) {
  p.push();

  const zigW = 30;
  const zigH = 20;

  for (let y = startY; y < startY + h; y += zigH) {
    p.beginShape();
    for (let x = -zigW; x <= p.width + zigW; x += zigW) {
      let warp = (p.noise(x * 0.01, y * 0.01) - 0.5) * 40;
      let offsetY = Math.floor(x / zigW) % 2 === 0 ? 0 : zigH;
      p.vertex(x, y + offsetY + warp);
    }
    p.endShape();
  }
  p.pop();
}

function nodeWeb(p, x1, y1, x2, y2) {
  p.push();
  p.stroke(0);
  p.strokeWeight(1.5);
  p.fill(0);

  let minX = Math.min(x1, x2);
  let maxX = Math.max(x1, x2);
  let minY = Math.min(y1, y2);
  let maxY = Math.max(y1, y2);
  let w = maxX - minX;
  let h = maxY - minY;

  let count = Math.floor((w + h) / 12);
  let nodes = [];

  for (let i = 0; i < count; i++) {
    let nx = minX + p.noise(i * 11.1) * w;
    let ny = minY + p.noise(i * 11.1 + 100) * h;
    nodes.push({ x: nx, y: ny });
    p.circle(nx, ny, 4);
  }

  let maxDist = Math.max(w, h) * 0.35;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < maxDist) {
        p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
  p.pop();
}

function funkyWeb(p, x1, y1, x2, y2) {
  p.push();
  p.stroke(0);
  p.strokeWeight(2);
  p.noFill();

  let minX = Math.min(x1, x2);
  let maxX = Math.max(x1, x2);
  let minY = Math.min(y1, y2);
  let maxY = Math.max(y1, y2);
  let w = maxX - minX;
  let h = maxY - minY;

  let numTendrils = Math.floor(w / 18) + 2;
  let spacing = w / (numTendrils - 1);
  let steps = 15;

  for (let i = 0; i < numTendrils; i++) {
    p.beginShape();
    let currX = minX + i * spacing;

    for (let step = 0; step <= steps; step++) {
      let currY = minY + (step / steps) * h;
      let drift = (p.noise(i, step * 0.2) - 0.5) * (w * 0.15);
      let clampedX = Math.min(Math.max(currX + drift, minX), maxX);
      p.vertex(clampedX, currY);
    }
    p.endShape();
  }
  p.pop();
}
