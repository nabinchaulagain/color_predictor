const trainBtn = document.querySelector("#trainBtn");
const predictBtn = document.querySelector("#predictBtn");
const fileBtn = document.querySelector("#file");
const saveBtn = document.querySelector("#save");
const trainBtns = document.querySelector("#trainBtns");
const startTrainBtn = document.querySelector("#startTrainBtn");
const color1 = document.querySelector("#color1");
const color2 = document.querySelector("#color2");
const dataSizeDisplayer = document.querySelector("#dataSizeDisplayer");
const predictionContainer = document.querySelector("#predictionContainer");
const winnerContainer = document.querySelector("#winnerContainer");
const predConfidence = document.querySelector("#predConfidence");
const predClass = document.querySelector("#predClass");
const ANIM_TIME = 2000;
let predPlayerInterval;
let randColor = new Color();

const neuralNetwork = new NeuralNetwork([3, 2, 2]);

color1.style.background = randColor.rgb;
color2.style.background = randColor.rgb;

let currMode = 0; // 0 is train mode and 1 is prediction mode
const dataset = [];

const hide = (elem) => {
  if (!elem.classList.contains("hidden")) {
    elem.classList.add("hidden");
  }
};
const unhide = (elem) => {
  if (elem.classList.contains("hidden")) {
    elem.classList.remove("hidden");
  }
};

const modeSwitcher = () => {
  trainBtn.disabled = !trainBtn.disabled;
  predictBtn.disabled = !predictBtn.disabled;
  if (currMode === 0) {
    currMode = 1;
    loadPredictMode();
  } else {
    currMode = 0;
    loadTrainMode();
  }
};
trainBtn.addEventListener("click", modeSwitcher);
predictBtn.addEventListener("click", modeSwitcher);

const showDatasetSize = function () {
  dataSizeDisplayer.innerHTML = `Dataset size: ${dataset.length}`;
};

const pickBlack = function () {
  dataset.push({ features: randColor.vals, labels: [1, 0] });
  showNewColors();
  showDatasetSize();
};

const pickWhite = function () {
  dataset.push({ features: randColor.vals, labels: [0, 1] });
  showNewColors();
  showDatasetSize();
};

function Color() {
  this.vals = [];
  for (let i = 0; i < 3; i++) {
    this.vals[i] = Math.floor(Math.random() * 256);
  }
  this.rgb = `rgb(${this.vals.join(",")})`;
}

const showNewColors = function () {
  randColor = new Color();
  color1.style.background = randColor.rgb;
  color2.style.background = randColor.rgb;
};
const loadPredictMode = function () {
  hide(trainBtns);
  unhide(predictionContainer);
  color1.removeEventListener("click", pickBlack);
  color2.removeEventListener("click", pickWhite);
  saveBtn.removeEventListener("click", downloadDataset);
  startTrainBtn.removeEventListener("click", trainNetwork);
  fileBtn.removeEventListener("change", uploadDataset);
  startPredictions();
};

const loadTrainMode = function () {
  unhide(trainBtns);
  hide(predictionContainer);
  color1.addEventListener("click", pickBlack);
  color2.addEventListener("click", pickWhite);
  saveBtn.addEventListener("click", downloadDataset);
  startTrainBtn.addEventListener("click", trainNetwork);
  fileBtn.addEventListener("change", uploadDataset);
  showDatasetSize();
  stopPredictions();
};

const trainNetwork = function () {
  if (dataset.length === 0) {
    alert("Cannot train on empty dataset");
    return;
  }
  const startTime = performance.now();
  const features = []; // feature vectors
  const labels = []; // label vectors
  for (let data of dataset) {
    feat_norm = data.features.map((feat) => feat / 255); // normalization
    features.push(new Matrix([feat_norm]).transpose());
    labels.push(new Matrix([data.labels]).transpose());
  }

  const cost_hist = neuralNetwork.train(features, labels, 0.3, 100);
  window.cost_hist = cost_hist;
  console.log(cost_hist);
  const endTime = performance.now();
  alert(`Trained for 100 epochs in ${(endTime - startTime) / 1000} seconds`);
};

const startPredictions = function () {
  const playOnce = () => {
    const colsNorm = randColor.vals.map((val) => val / 255); // normalizing
    const input = new Matrix([colsNorm]).transpose();
    const pred = neuralNetwork.predict(input);
    winnerContainer.style.textAlign = pred.class === 0 ? "left" : "right";
    predConfidence.innerText = pred.confidence.toFixed(2);
    showNewColors();
  };
  playOnce();
  predPlayerInterval = setInterval(playOnce, ANIM_TIME);
};

const stopPredictions = function () {
  clearInterval(predPlayerInterval);
};

const uploadDataset = function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    const datasetUploaded = JSON.parse(this.result);
    dataset.push(...datasetUploaded);
    showDatasetSize();
  };
};

const downloadDataset = function () {
  const a = document.createElement("a");
  const blob = new Blob([JSON.stringify(dataset)], { type: "plain/text" });
  a.href = URL.createObjectURL(blob);
  a.download = "colors.json";
  a.click();
};

loadTrainMode();
