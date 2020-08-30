function Matrix(data) {
  this.data = data;
  this.shape = [this.data.length, this.data[0].length];
}
Matrix.prototype._binaryOperation = function (mat2, operator) {
  if (
    this.data.length !== mat2.data.length ||
    this.data[0].length !== mat2.data[0].length
  ) {
    throw new Error(`dimension mismatch ${this.shape}* ${mat2.shape}`);
  }
  const newData = this.data.map((col) => col.map((_) => 0));
  for (let i = 0; i < this.data.length; i++) {
    for (let j = 0; j < this.data[0].length; j++) {
      newData[i][j] = operator(this.data[i][j], mat2.data[i][j]);
    }
  }
  return new Matrix(newData);
};

Matrix.prototype.add = function (mat2) {
  return this._binaryOperation(mat2, (num1, num2) => num1 + num2);
};

Matrix.prototype.subtract = function (mat2) {
  return this._binaryOperation(mat2, (num1, num2) => num1 - num2);
};

Matrix.prototype.multiply = function (mat2) {
  if (mat2 instanceof Matrix) {
    return this._binaryOperation(mat2, (num1, num2) => num1 * num2);
  } else {
    const newData = this.data.map((col) => col.map((val) => val * mat2));
    return new Matrix(newData);
  }
};

Matrix.prototype.dot = function (mat2) {
  if (this.data[0].length !== mat2.data.length) {
    throw new Error(`dimension mismatch ${this.shape}* ${mat2.shape}`);
  }
  const newData = Array(this.data.length)
    .fill(0)
    .map(() => Array(mat2.data[0].length));
  for (let i = 0; i < this.data.length; i++) {
    for (let j = 0; j < mat2.data[0].length; j++) {
      let val = 0;
      for (let k = 0; k < mat2.data.length; k++) {
        val += this.data[i][k] * mat2.data[k][j];
      }
      newData[i][j] = val;
    }
  }
  return new Matrix(newData);
};

Matrix.prototype.transpose = function () {
  const newData = Array(this.data[0].length);
  for (let i = 0; i < newData.length; i++) {
    newData[i] = Array(this.data.length);
  }
  iter = 0;
  for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < newData[0].length; j++) {
      newData[i][j] = this.data[j][i];
    }
    iter++;
  }
  return new Matrix(newData);
};

Matrix.prototype.map = function (func) {
  const newData = new Array(this.data.length)
    .fill(0)
    .map(() => new Array(this.data[0].length));
  for (let i = 0; i < this.data.length; i++) {
    for (let j = 0; j < this.data[0].length; j++) {
      newData[i][j] = func(this.data[i][j]);
    }
  }
  return new Matrix(newData);
};

Matrix.prototype.print = function () {
  console.table(this.data);
};

Matrix.randomInit = function (xdim, ydim, low, high) {
  if (low > high) {
    throw new Error("range invalid");
  }
  const matrix = new Matrix(
    Array(xdim)
      .fill(0)
      .map(() =>
        Array(ydim)
          .fill(0)
          .map(() => Math.random() * (high - low) + low)
      )
  );
  return matrix;
};

Matrix.prototype.copy = function () {
  const copyData = this.data.map((row) => [...row]);
  return new Matrix(copyData);
};
