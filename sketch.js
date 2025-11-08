let data;
let img;
let volcanoes = [];
let hoverRadius = 8;

let boxWidth, boxHeight, boxX, boxY;
let padding = 10;
let legendHeight = 100; // spazio riservato sopra la mappa

function preload() {
  data = loadTable("assets/data_volcanoes.csv", "csv", "header");
  img = loadImage("assets/worldmap.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight + legendHeight);
  noLoop();
  background(30);

  boxWidth = width * 0.9;
  boxHeight = height * 0.9 - legendHeight;
  boxX = (width - boxWidth) / 2;
  boxY = legendHeight + ((height - legendHeight) - boxHeight) / 2;

  for (let i = 0; i < data.getRowCount(); i++) {
    let lat = data.getNum(i, "Latitude");
    let lon = data.getNum(i, "Longitude");
    let type = data.getString(i, "TypeCategory");
    let name = data.getString(i, "Volcano Name");
    let country = data.getString(i, "Country");
    let type_volcano = data.getString(i, "Type");
    let elevation = data.getString(i, "Elevation (m)");
    let status = data.getString(i, "Status");
    let last_eruption = data.getString(i, "Last Known Eruption");

    if (isNaN(lat) || isNaN(lon) || !type) continue;

    let pos = geoToPixelInCenterBox(lat, lon);
    let x = pos.x;
    let y = pos.y;

    drawGlyph(x, y, type);
    volcanoes.push({ x, y, name, country, elevation, type, type_volcano, status, last_eruption });
  }
}

function draw() {
  background(30);
  drawLegend();

  image(img, boxX, boxY, boxWidth, boxHeight);

  stroke(255);
  noFill();
  rect(boxX, boxY, boxWidth, boxHeight);

  for (let v of volcanoes) {
    drawGlyph(v.x, v.y, v.type);
  }

  for (let v of volcanoes) {
    if (dist(mouseX, mouseY, v.x, v.y) < hoverRadius) {
      drawTooltip(v);
      break;
    }
  }
}

function mouseMoved() {
  redraw();
}

function drawTooltip(v) {
  let w = 150;
  let h = 150;
  let tx = v.x + 10;
  let ty = v.y + 10;

  if (tx + w > boxX + boxWidth) tx = v.x - w - 10;
  if (ty + h > boxY + boxHeight) ty = v.y - h - 10;

  fill(0, 180);
  stroke(255);
  rect(tx, ty, w, h, 5);

  fill(255);
  noStroke();
  textSize(8);
  text(`🌋 ${v.name}`, tx + 10, ty + 22);
  text(`📍 ${v.country}`, tx + 10, ty + 40);
  text(`🧭 ${v.type}`, tx + 10, ty + 58);
  text(`Elevation: ${v.elevation}`, tx + 10, ty + 76);
  text(`Type: ${v.type_volcano}`, tx + 10, ty + 94);
  text(`Status: ${v.status}`, tx + 10, ty + 110);
  text(`Last eruption: ${v.last_eruption}`, tx + 10, ty + 128);
}

function drawGlyph(x, y, type) {
  push();
  translate(x, y);
  noStroke();

  switch (type) {
    case "Stratovolcano": fill("#e74c3c"); break;
    case "Cone": fill("#f39c12"); break;
    case "Caldera": fill("#9b59b6"); break;
    case "Crater System": fill("#3498db"); break;
    case "Maars / Tuff ring": fill("#1abc9c"); break;
    case "Shield Volcano": fill("#2ecc71"); break;
    case "Submarine Volcano": fill("#34495e"); break;
    case "Other / Unknown":
    default: fill("white");
  }

  triangle(-6, 6, 6, 6, 0, -6);
  pop();
}

function drawLegend() {
  let spacingX = 140;
  let spacingY = 20;
  let internalPadding = 10;

  let legendX = boxX;
  let legendY = boxY - legendHeight;
  let boxW = spacingX * 4 + internalPadding * 2;
  let boxH = 60 + spacingY;

  // Sfondo della legenda
  fill(0, 180);
  stroke(255);
  rect(legendX, legendY, boxW, boxH, 5);

  // Contenuto con padding interno
  let contentX = legendX + internalPadding;
  let contentY = legendY + internalPadding;

  fill(255);
  noStroke();
  textSize(12);
  text("Legenda tipi di vulcano:", contentX, contentY);

  let types = [
    { label: "Stratovolcano", color: "#e74c3c" },
    { label: "Cone", color: "#f39c12" },
    { label: "Caldera", color: "#9b59b6" },
    { label: "Crater System", color: "#3498db" },
    { label: "Maars / Tuff ring", color: "#1abc9c" },
    { label: "Shield Volcano", color: "#2ecc71" },
    { label: "Submarine Volcano", color: "#34495e" },
    { label: "Other / Unknown", color: "white" }
  ];

  for (let i = 0; i < types.length; i++) {
    let col = i % 4;
    let row = floor(i / 4);

    let x = contentX + col * spacingX;
    let y = contentY + 20 + row * spacingY;

    fill(types[i].color);
    triangle(x, y + 8, x + 12, y + 8, x + 6, y - 4);
    fill(255);
    textSize(10);
    text(types[i].label, x + 18, y + 6);
  }
}

function geoToPixelInCenterBox(lat, lon) {
  let minLat = -90;
  let maxLat = 90;
  let minLon = -180;
  let maxLon = 180;

  let x = map(lon, minLon, maxLon, boxX + padding, boxX + boxWidth - padding);
  let y = map(lat, maxLat, minLat, boxY + padding, boxY + boxHeight - padding);

  return { x, y };
}