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

const loadTrainMode = function () {
  unhide(trainBtns);
  hide(predictionContainer);
  color1.addEventListener("click", pickBlack);
  color2.addEventListener("click", pickWhite);
  saveBtn.addEventListener("click", downloadDataset);
  startTrainBtn.addEventListener("click", trainNetwork);
  fileBtn.addEventListener("change", uploadDataset);
  saveNetBtn.removeEventListener("click", saveNetwork);
  loadNetBtn.removeEventListener("change", loadNetwork);
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
  downloadFile("colors.json", JSON.stringify(dataset));
};
