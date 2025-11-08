// Variabile che conterrà i dati caricati dal CSV
let data;
let minLon, maxLon, minLat, maxLat;
let outerMargin = 100;

function preload() {
  data = loadTable("assets/data_volcanoes.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);

  let allLon = data.getColumn("Longitude").map(Number);
  let allLat = data.getColumn("Latitude").map(Number);

  minLon = min(allLon);
  maxLon = max(allLon);
  minLat = min(allLat);
  maxLat = max(allLat);

  for (let i = 0; i < data.getRowCount(); i++) {
    let lat = data.getNum(i, "Latitude");
    let lon = data.getNum(i, "Longitude");
    let type = data.getString(i, "TypeCategory");

    if (isNaN(lat) || isNaN(lon) || !type) continue;

    let x = map(lon, minLon, maxLon, outerMargin, width - outerMargin);
    let y = map(lat, minLat, maxLat, height - outerMargin, outerMargin);

    drawGlyph(x, y, type);
  }
}

function drawGlyph(x, y, type) {
  push();
  translate(x, y);
  noStroke();
  fill("orange");

  switch (type) {
    case "Stratovolcano":
      stroke("orange");
      noFill();
      triangle(-6, 6, 6, 6, 0, -6);
      break;
    case "Cone":
      stroke("orange");
      noFill();
      ellipse(0, 0, 14, 8); // ellisse piatta
      break;
    case "Caldera":
      stroke("orange");
      noFill();
      ellipse(0, 0, 12, 12); // cerchio vuoto
      break;
    case "Crater System":
      stroke("orange");
      noFill();
      beginShape(); // stella irregolare
      vertex(-6, 0);
      vertex(-2, -6);
      vertex(2, -6);
      vertex(6, 0);
      vertex(2, 6);
      vertex(-2, 6);
      endShape();
      break;
    case "Maars / Tuff ring":
      stroke("orange");
      noFill();
      rect(6, 6, 12, 12) 
      break;
    case "Shield Volcano":
      stroke("orange");
      noFill();
      beginShape(); // rombo
      push();
      rotate(PI / 4); // ruota di 45°
      rect(-5, -5, 10, 10); // quadrato ruotato
      pop();
      break;
    case "Submarine Volcano":
      stroke("orange");
      noFill();
      triangle(-6, -6, 6, -6, 0, 6); // triangolo invertito
      break;
    case "Other / Unknown":
       stroke("orange");
       strokeWeight(2);
       noFill();
       line(-5, -5, 5, 5); // diagonale \
       line(-5, 5, 5, -5); // diagonale /
       break;
  }

  pop();
}