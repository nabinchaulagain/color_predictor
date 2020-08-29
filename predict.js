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
