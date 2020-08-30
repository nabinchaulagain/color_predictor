function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoid_prime(x) {
  return sigmoid(x) * (1 - sigmoid(x));
}
function NeuralNetwork(architecture) {
  this.i_units = architecture[0];
  this.h_units = architecture[1];
  this.o_units = architecture[2];
  this.initParams();
}
NeuralNetwork.prototype.initParams = function () {
  this.w1 = Matrix.randomInit(this.h_units, this.i_units, -1, 1);
  this.w2 = Matrix.randomInit(this.o_units, this.h_units, -1, 1);
  this.b1 = Matrix.randomInit(this.h_units, 1, 0, 0);
  this.b2 = Matrix.randomInit(this.o_units, 1, 0, 0);
};

NeuralNetwork.prototype.forward_prop = function (input) {
  this.a0 = input;
  this.z1 = this.w1.dot(this.a0).add(this.b1);
  this.a1 = this.z1.map(sigmoid);
  this.z2 = this.w2.dot(this.a1).add(this.b2);
  this.a2 = this.z2.map(sigmoid);
  return this.a2;
};

NeuralNetwork.prototype.computeCost = function (inputs, labels) {
  let cost = 0;
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const label = labels[i];
    this.forward_prop(input);
    const labelPredicted = this.a2;
    for (let j = 0; j < label.shape[0]; j++) {
      const label_class = label.data[j][0];
      const predicted_class = labelPredicted.data[j][0];
      cost +=
        label_class * Math.log(predicted_class) +
        (1 - label_class) * Math.log(1 - predicted_class);
    }
  }
  return (-1 / inputs.length) * cost;
};

NeuralNetwork.prototype.train = function (inputs, labels, alpha, epochs = 50) {
  const costHist = [];
  for (let i = 0; i < epochs; i++) {
    inputs.forEach((input, idx) => {
      this.forward_prop(input);
      const delta2 = this.a2.subtract(labels[idx]);
      const delta1 = this.w2
        .transpose()
        .dot(delta2)
        .multiply(this.z1.map(sigmoid_prime));
      const dw2 = delta2.dot(this.a1.transpose());
      const dw1 = delta1.dot(this.a0.transpose());
      const db2 = delta2;
      const db1 = delta1;
      this.w2 = this.w2.subtract(dw2.multiply(alpha));
      this.w1 = this.w1.subtract(dw1.multiply(alpha));
      this.b2 = this.b2.subtract(db2.multiply(alpha));
      this.b1 = this.b1.subtract(db1.multiply(alpha));
      costHist[i] = this.computeCost(inputs, labels);
    });
  }
  return costHist;
};

NeuralNetwork.prototype.predict = function (input) {
  // predict class with most confidence
  const outputs = this.forward_prop(input);
  let maxConf = 0;
  let chosenClass = -1;
  for (let i = 0; i < outputs.shape[0]; i++) {
    const conf = outputs.data[i][0];
    if (conf > maxConf) {
      maxConf = conf;
      chosenClass = i;
    }
  }
  return { class: chosenClass, confidence: maxConf };
};

NeuralNetwork.prototype.serialize = function () {
  return JSON.stringify(this);
};

NeuralNetwork.deserialize = function (json) {
  const nnSaved = JSON.parse(json);
  const nn = new NeuralNetwork([
    nnSaved.i_units,
    nnSaved.h_units,
    nnSaved.o_units,
  ]);
  nn.w1 = new Matrix(nnSaved.w1.data);
  nn.w2 = new Matrix(nnSaved.w2.data);
  nn.b1 = new Matrix(nnSaved.b1.data);
  nn.b2 = new Matrix(nnSaved.b2.data);
  return nn;
};
