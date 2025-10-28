let data;

let minLat, minLon, maxLat, maxLon;

function preload() {
data = loadTable("assets/data.csv", "csv", "header")
}

function setup() {
  // per creare sketch resposive
  createCanvas(windowWidth, windowHeight);

  // definisco min e max per latitutine 
  let allLat = data.getColumn("latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

  let allLon = data.getColumn("longitude");
  minLon = min(allLon);
  maxLon = max (allLon);

  console.log(minLon, maxLon);
}

function draw() {
  background(10);

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
  console.log(rowNumber);
  /* leggo i dati della singola riga e, con la funzione, 
  prendo tutti i dati e mi faccio restituire il valore relativo alla riga */
  let lon = data.getNum(rowNumber, "longitude");
  let lat = data.getNum(rowNumber, "latitude");
  let name = data.getString(rowNumber, "country")

  /* converto le coordinate geografiche in coordinate pixel
  - considero il valore base, il minimo di partenza ed il massimo in rapporto -
  quando il valore è 90 mi deve restituire 0 e quando è -90 devo trovare l'altezza  */
  let x = map(lon, minLon, maxLon, 0, width);
  /* per convenzione il polo nord deve essere in alto ed il sud in basso 
  quindi, in questo caso, inverto i valori */
  let y = map(lat, minLat, maxLat, height, 0);
  // uso la variabile, anzichè direttamente 20 per mantenere il tutto più pulito
  let radius = 20


  /* per definire le scale, associare i dati e aggiungere la sfocatura - visto veloce con il prof, da rivedere!

  // Scala per la longitudine → asse X
  let allLon = data.getColumn("longitude");
  minLon = min(allLon);
  maxLon = max(allLon);

  // Scala per la latitudine → asse Y
  let allLat = data.getColumn("latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

  // Scala per il raggio → dipende dal valore numerico
  let allValues = data.getColumn("value");
  maxValue = max(allValues);

  // Scala per il blur → dipende dal grado di incertezza
  let allBlur = data.getColumn("uncertainty");
  minBlur = min(allBlur);
  maxBlur = max(allBlur);

  */

/* PER IL MOUSE - se la distanza è maggiore del raggio significa che siamo fuori
- viceversa, se questa è minore, siamo all'interno */

// con mouseX e mouseY ho già delle coordinate predefinite - calcolo distanza del mouse
let d = dist(x, y, mouseX, mouseY);

if (d < radius) {
  fill("red");
}

if (d > radius) {
  fill("yellow");
}

// dato che il terzo parametro che l'ellisse si aspetta è il diametro - moltiplico x2

ellipse(x, y, radius * 2);

// per far comparire il nome solo quando passo il mouse
if(d < radius) {
  fill("white");
  text(name, x, y);
}




}


}

