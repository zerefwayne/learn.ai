<template>
  <div class="app-sandbox">
    <div class="option-pane">
      <div>
        <h5 class="section-header">Blocks</h5>
        <ul class="list-group">
          <li class="list-group-item block-button">
            <div>
              Dense Layer
            </div>
            <div style="display: flex; align-items: center;">
              <img class="click-icon mr-2" src="@/assets/info.svg" />
              <img
                @click="addShape('ellipse')"
                class="click-icon"
                src="@/assets/add.svg"
              />
            </div>
          </li>
          <li class="list-group-item block-button">
            <div>
              Max Pooling Layer
            </div>
            <div>
              <img class="click-icon mr-2" src="@/assets/info.svg" />
              <img
                @click="addShape('rectangle')"
                class="click-icon"
                src="@/assets/add.svg"
              />
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
          <li class="list-group-item action-button">Train</li>
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

import ConvLayerFunc from "@/interactions/ConvLayer.js";
import DenseLayerFunc from "@/interactions/DenseLayer.js";
import MaxPoolLayerFunc from "@/interactions/MaxPoolLayer.js";
import FlattenFunc from "@/interactions/Flatten.js";
import ObjectFunc from "@/interactions/object.js";

let ConvLayer = null;
let DenseLayer = null;
let MaxPoolLayer = null;
let FlattenLayer = null;
let Block = null;

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
      hyperparameters: {
        optimizer: "Adam",
        loss: "binarycrossentropy/mse",
        learning_rate: 0.02
      },
      layers: [
        {
          type: "Conv Layer",
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
          required_data: [
            {
              key: "kernel_shape",
              text: "Shape of Kernel"
            }
          ]
        },
        {
          type: "Flatten Layer"
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
      Block = ObjectFunc(sketch);

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
            this.resultArray[i].type == "rectangle" &&
            sketch.mouseX >= this.resultArray[i].x &&
            sketch.mouseX <=
              this.resultArray[i].x + this.resultArray[i].sizex &&
            sketch.mouseY >= this.resultArray[i].y &&
            sketch.mouseY <= this.resultArray[i].y + this.resultArray[i].sizey
          ) {
            this.active = i;
            break;
          }
          if (
            this.resultArray[i].type == "ellipse" &&
            sketch.mouseX >=
              this.resultArray[i].x - this.resultArray[i].sizex / 2 &&
            sketch.mouseX <=
              this.resultArray[i].x + this.resultArray[i].sizex / 2 &&
            sketch.mouseY >=
              this.resultArray[i].y - this.resultArray[i].sizey / 2 &&
            sketch.mouseY <=
              this.resultArray[i].y + this.resultArray[i].sizey / 2
          ) {
            this.active = i;
            break;
          }
        }
      };

      sketch.mouseDragged = () => {
        if (this.resultArray[this.active].type == "ellipse") {
          this.resultArray[this.active].x = sketch.mouseX;
          this.resultArray[this.active].y = sketch.mouseY;
          this.resultArray[this.active].rem();
        }
        if (this.resultArray[this.active].type == "rectangle") {
          this.resultArray[this.active].x =
            sketch.mouseX - this.resultArray[this.active].sizex / 2;
          this.resultArray[this.active].y =
            sketch.mouseY - this.resultArray[this.active].sizey / 2;
          this.resultArray[this.active].rem();
        }
      };

      sketch.mouseReleased = () => {
        this.active = null;
      };
    },
    addShape(shapeName) {
      if (shapeName == "ellipse") {
        let ellipse = new Block("rectangle", 25, 50, 80, 80, 4);
        ellipse.propContent([
          "Layer Type",
          "Number of Nodes",
          "Activation Type"
        ]);
        this.resultArray.push(ellipse);
      } else if (shapeName == "rectangle") {
        let rectangle = new Block("rectangle", 25, 150, 80, 80, 4);

        rectangle.propContent([
          "Layer Type",
          "Number of Nodes",
          "Activation Type"
        ]);
        this.resultArray.push(rectangle);
      }
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
}
</style>
