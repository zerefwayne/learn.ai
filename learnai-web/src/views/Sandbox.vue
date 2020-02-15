<template>
  <div class="app-sandbox">
    <div class="option-pane">
      <div>
        <h5 class="section-header">Blocks</h5>
        <ul class="list-group">
          <li
            class="list-group-item block-button"
            v-for="layer in layers"
            :key="layer.type"
          >
            <div>
              {{ layer.type }}
            </div>
            <div style="display: flex; align-items: center;">
              <button
                data-toggle="modal"
                :data-target="'#' + layer.key + '-modal'"
                data-backdrop="false"
                style="background: transparent; border: none; box-shadow: none; outline: none;"
              >
                <img class="click-icon" src="@/assets/add.svg" />
              </button>
              <div
                class="modal fade"
                :id="layer.key + '-modal'"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog custom-modal-style" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        {{ layer.type }}
                      </h5>
                    </div>
                    <div class="modal-body">
                      <form>
                        <div
                          class="form-group"
                          v-for="formgroup in layer.required_data"
                          :key="formgroup.key"
                        >
                          <label for="exampleInputEmail1">{{
                            formgroup.text
                          }}</label>
                          <input
                            type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            :placeholder="'Enter ' + formgroup.text"
                            autocomplete="off"
                            v-model="modal_data[formgroup.key]"
                          />
                        </div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn action-button mb-0 mr-2"
                        data-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        class="btn action-button mb-0"
                        data-dismiss="modal"
                        @click="addLayer(layer.key)"
                      >
                        Add Layer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h5 class="section-header">Actions</h5>
        <ul class="list-group">
          <li class="list-group-item action-button" @click="arrangeShapes">
            Arrange
          </li>
          <li class="list-group-item action-button">Download .py</li>
          <li class="list-group-item action-button" @click="parseMLGraph()">
            Train
          </li>
        </ul>
      </div>
    </div>

    <div class="canvas-pane">
      <div ref="sandboxcanvas"></div>
    </div>
  </div>
</template>

<script>
import p5 from "p5";
import * as tf from "@tensorflow/tfjs";

import ConvLayerFunc from "@/interactions/ConvLayer.js";
import DenseLayerFunc from "@/interactions/DenseLayer.js";
import MaxPoolLayerFunc from "@/interactions/MaxPoolLayer.js";
import FlattenFunc from "@/interactions/Flatten.js";

let ConvLayer = null;
let DenseLayer = null;
let MaxPoolLayer = null;
let FlattenLayer = null;

class ModelCreator {
  constructor(noOfInputVars) {
    this.model = tf.sequential();
    this.previousInputShape = noOfInputVars;
  }

  getTensorMap(data, channels = 2) {
    var refData = data;
    var tensorShape = [];
    for (var i = 1; i <= channels; i++) {
      tensorShape.push(refData.length);
      refData = refData[0];
    }
    return tf.tensor2d(data, tensorShape);
  }

  addDenseLayer(noOfUnits, activation = "sigmoid") {
    if (this.previousInputShape != -1) {
      this.model.add(
        tf.layers.dense({
          units: noOfUnits,
          inputShape: this.previousInputShape,
          activation: activation,
          kernelInitializer: "heNormal"
        })
      );
    } else {
      this.model.add(
        tf.layers.dense({
          units: noOfUnits,
          activation: activation,
          kernelInitializer: "heNormal"
        })
      );
    }

    this.previousInputShape = -1;
  }

  addConvLayer(n_filters, kernelSize = 3, strides = 1, activation = "relu") {
    if (this.previousInputShape != -1) {
      this.model.add(
        tf.layers.conv2d({
          filters: n_filters,
          kernelSize: kernelSize,
          strides: strides,
          activation: activation,
          kernelInitializer: "heNormal",
          inputShape: this.previousInputShape
        })
      );
      this.previousInputShape = -1;
    } else {
      this.model.add(
        tf.layers.conv2d({
          filters: n_filters,
          kernelSize: kernelSize,
          strides: strides,
          activation: activation,
          kernelInitializer: "heNormal"
        })
      );
    }
  }

  addMaxPoolLayer(poolSize = [2, 2]) {
    this.model.add(
      tf.layers.maxPooling2d({
        poolSize: poolSize
      })
    );
  }

  flatten() {
    this.model.add(tf.layers.flatten());
  }

  compileModel(parameters) {
    this.model.compile(parameters);
  }

  async trainModel(
    trainXList,
    trainYList,
    epochs = 1000,
    channel1 = 2,
    channel2 = 2
  ) {
    await this.model.fit(
      this.getTensorMap(trainXList, channel1),
      this.getTensorMap(trainYList, channel2),
      { epochs: epochs }
    );
  }

  makePredictions(testXList) {
    var data = this.getTensorMap(testXList);
    this.model.predict(this.getTensorMap(testXList)).print();
  }
}

function initializeModelFromJSON(modelJson) {
  let inputSize = modelJson.model;
  let layers = modelJson.layers;

  let creator = new ModelCreator([inputSize]);

  layers.forEach(layer => {
    if (layer.type === "dense") {
      creator.addDenseLayer(layer.no, layer.activation);
    }
  });

  let optimizerStr = modelJson.parameters.optimizer.type;

  var optimizer;
  if (optimizerStr === "adam") {
    optimizer = tf.train.adam(modelJson.parameters.optimizer.lr, 0.2);
  }

  creator.compileModel({
    optimizer: optimizer,
    loss: modelJson.parameters.loss
  });

  return creator;
}

export default {
  name: "Sandbox",
  data() {
    return {
      provider: {
        context: null,
        width: 0,
        height: 0
      },
      x: 0,
      y: 0,
      resultArray: [],
      active: null,
      sketch: null,
      model_runner: null,
      hyperparameters: {
        optimizer: "adam",
        loss: "binarCrossentropy",
        learning_rate: 0.02
      },
      modal_data: {
        type: null,
        n_filters: null,
        kernel_shape: null,
        padding: null,
        activation: null,
        no: null
      },
      layers: [
        {
          type: "Conv Layer",
          key: "conv",
          required_data: [
            {
              key: "n_filters",
              text: "Number of Filters"
            },
            {
              key: "kernel_shape",
              text: "Shape of Kernel"
            },
            {
              key: "padding",
              text: "Padding"
            },
            {
              key: "activation",
              text: "Activation Function"
            }
          ]
        },
        {
          type: "Dense Layer",
          key: "dense",
          required_data: [
            {
              key: "nodes",
              text: "Number of Nodes"
            },
            {
              key: "activation",
              text: "Activation Function"
            }
          ]
        },
        {
          type: "Max Pool Layer",
          key: "maxpool",
          required_data: [
            {
              key: "kernel_shape",
              text: "Shape of Kernel"
            }
          ]
        },
        {
          type: "Flatten Layer",
          key: "flatten"
        }
      ]
    };
  },
  methods: {
    s(sketch) {
      this.sketch = sketch;

      ConvLayer = ConvLayerFunc(sketch);
      DenseLayer = DenseLayerFunc(sketch);
      MaxPoolLayer = MaxPoolLayerFunc(sketch);
      FlattenLayer = FlattenFunc(sketch);

      console.log("Prototype", Object.getPrototypeOf(sketch));

      sketch.setup = () => {
        sketch.createCanvas(this.provider.width, this.provider.height);

        sketch.draw = () => {
          sketch.background("#2d2d2d");

          for (var i = 0; i < this.resultArray.length; i++) {
            this.resultArray[i].display();
            this.resultArray[i].rem();
          }
        };
      };

      sketch.mousePressed = () => {
        for (var i = 0; i < this.resultArray.length; i++) {
          if (
            sketch.mouseX >= this.resultArray[i].x &&
            sketch.mouseX <=
              this.resultArray[i].x + this.resultArray[i].sizex &&
            sketch.mouseY >= this.resultArray[i].y &&
            sketch.mouseY <= this.resultArray[i].y + this.resultArray[i].sizey
          ) {
            this.active = i;
            break;
          }
        }
      };

      sketch.mouseDragged = () => {
        this.resultArray[this.active].x =
          sketch.mouseX - this.resultArray[this.active].sizex / 2;
        this.resultArray[this.active].y =
          sketch.mouseY - this.resultArray[this.active].sizey / 2;
        this.resultArray[this.active].rem();
      };

      sketch.mouseReleased = () => {
        this.active = null;
      };
    },
    addLayer(layerName) {
      if (layerName == "conv") {
        let convLayer = new ConvLayer(
          layerName,
          this.modal_data["n_filters"],
          this.modal_data["kernel_shape"],
          this.modal_data["padding"],
          this.modal_data["activation"],
          25,
          50,
          80,
          80
        );

        this.resultArray.push(convLayer);
      } else if (layerName == "dense") {
        let denseLayer = new DenseLayer(
          layerName,
          this.modal_data["nodes"],
          this.modal_data["activation"],
          25,
          50,
          80,
          80
        );

        this.resultArray.push(denseLayer);
      } else if (layerName == "maxpool") {
        let maxPoolLayer = new MaxPoolLayer(
          layerName,
          this.modal_data["kernel_shape"],
          25,
          50,
          80,
          80
        );

        this.resultArray.push(maxPoolLayer);
      } else if (layerName == "flatten") {
        let flattenLayer = new FlattenLayer(layerName, 25, 50, 80, 80);
        this.resultArray.push(flattenLayer);
      }

      this.modal_data = {
        type: null,
        n_filters: null,
        kernel_shape: null,
        padding: null,
        activation: null,
        no: null
      };
    },
    arrangeShapes() {
      this.resultArray.sort((a, b) => {
        return a.x - b.x;
      });
      for (var i = 0; i < this.resultArray.length; i++) {
        if (i == 0) {
          this.resultArray[i].x = this.resultArray[i].sizex + 50;
        }
        if (i > 0) {
          this.resultArray[i].x =
            this.resultArray[i - 1].x + 80 + this.resultArray[i - 1].sizex;
        }
        this.resultArray[i].y =
          this.provider.height / 2 - this.resultArray[i].sizey / 2;
      }
    },
    parseMLGraph() {
      let parsedJSON = {
        model: 2,
        layers: [],
        parameters: {
          optimizer: {
            type: "adam",
            lr: "0.02"
          },
          loss: "binaryCrossentropy"
        }
      };

      for (let i = 0; i < this.resultArray.length; i++) {
        parsedJSON.layers.push(this.resultArray[i].returnData());
      }

      console.log(parsedJSON);

      console.log("Generating model!");

      this.model = initializeModelFromJSON(parsedJSON);

      this.model
        .trainModel(
          [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
          ],
          [[0], [1], [1], [0]],
          500
        )
        .then(() => {
          console.log("Done with training");
          this.model.makePredictions([
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 0],
            [0, 1],
            [0, 1]
          ]);
        });
    }
  },
  provide() {
    return {
      provider: this.provider
    };
  },
  mounted() {
    let myp5 = new p5(this.s, this.$refs["sandboxcanvas"]);

    this.provider.width = this.$refs["sandboxcanvas"].parentElement.clientWidth;
    this.provider.height = this.$refs[
      "sandboxcanvas"
    ].parentElement.clientHeight;
  }
};
</script>

<style lang="scss" scoped>
.app-sandbox {
  background-color: #353535;
  height: 94vh;
  width: 100%;
  color: white;

  display: flex;

  .option-pane {
    flex: 0 0 25%;
    background-color: #2e2e2e;
    border-right: 2px solid #f68000;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 1rem 3rem;
    font-family: "IBM Plex Mono" !important;
    position: relative;
  }

  .section-header {
    font-family: "IBM Plex Mono", monospace;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  .block-button {
    color: white;
    background-color: transparent;
    box-shadow: none;
    border: 2px dashed #aaaaaa;
    border-radius: 6px;
    font-family: "IBM Plex Mono" !important;
    font-weight: bold;
    margin-bottom: 1rem;

    display: flex;
    justify-content: space-between;

    position: relative;
  }

  .action-button {
    color: white;
    background-color: transparent;
    box-shadow: none;
    border: 2px dashed #aaaaaa;
    border-radius: 6px;
    font-family: "IBM Plex Mono" !important;
    font-weight: bold;
    margin-bottom: 1rem;

    display: flex;
    justify-content: space-between;

    width: fit-content;
    cursor: pointer;
  }

  .canvas-pane {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .click-icon {
    cursor: pointer;
  }

  .custom-modal-style {
    .modal-content {
      border-radius: 10px;

      overflow: hidden;
    }

    .modal-title {
      color: #121212;
      font-family: "IBM Plex Mono", monospace;
    }

    .modal-header {
      background-color: #efefef;
      border-bottom: 2px solid #f68000;
    }

    .modal-body {
      background-color: #ededed;
      color: #121212;
    }

    .modal-footer {
      background-color: #efefef;
      border-top: 2px solid #f68000;

      .action-button {
        color: #121212;
      }
    }
  }
}
</style>
