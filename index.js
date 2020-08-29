//globals
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

const neuralNetwork = new NeuralNetwork([3, 2, 2]);

let randColor = new Color();

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
  //switch between training mode and prediction mode
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

loadTrainMode();
