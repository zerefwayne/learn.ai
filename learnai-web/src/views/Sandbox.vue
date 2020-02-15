<template>
  <div class="app-sandbox">
    <div class="option-pane">
      Hello
    </div>

    <div class="canvas-pane">
      <div ref="sandboxcanvas"></div>
    </div>
  </div>
</template>

<script>
import p5 from "p5";
import GenerateBlock from "@/interactions/object.js";
// import sketch from "@/assets/sketch.js";

let Block = null;

export default {
  name: "Sandbox",
  data() {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        context: null,
        width: 0,
        height: 0
      },
      x: 0,
      y: 0,
      resultArray: [],
      active: null
    };
  },
  methods: {
    s(sketch) {
      Block = GenerateBlock(sketch);

      console.log("Prototype", Object.getPrototypeOf(sketch));

      sketch.setup = () => {
        sketch.createCanvas(this.provider.width, this.provider.height);

        sketch.draw = () => {
          sketch.background("#3d3d3d");
          sketch.fill(250, 200, 200, 50);
          sketch.ellipse(40, 20, 30, 30);

          sketch.fill(250, 200, 200, 50);
          sketch.rect(25, 50, 30, 30);

          for (var i = 0; i < this.resultArray.length; i++) {
            this.resultArray[i].display();
          }
        };
      };

      sketch.mousePressed = () => {
        for (var i = 0; i < this.resultArray.length; i++) {
          if (
            this.resultArray[i].type == "rectangle" &&
            sketch.mouseX >= this.resultArray[i].x &&
            sketch.mouseX <= this.resultArray[i].x + this.resultArray[i].sizex &&
            sketch.mouseY >= this.resultArray[i].y &&
            sketch.mouseY <= this.resultArray[i].y + this.resultArray[i].sizey
          ) {
            this.active = i;
            break;
          }
          if (
            this.resultArray[i].type == "ellipse" &&
            sketch.mouseX >= this.resultArray[i].x - this.resultArray[i].sizex / 2 &&
            sketch.mouseX <= this.resultArray[i].x + this.resultArray[i].sizex / 2 &&
            sketch.mouseY >= this.resultArray[i].y - this.resultArray[i].sizey / 2 &&
            sketch.mouseY <= this.resultArray[i].y + this.resultArray[i].sizey / 2
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
        }
        if (this.resultArray[this.active].type == "rectangle") {
          this.resultArray[this.active].x =
            sketch.mouseX - this.resultArray[this.active].sizex / 2;
          this.resultArray[this.active].y =
            sketch.mouseY - this.resultArray[this.active].sizey / 2;
        }
      };

      sketch.mouseReleased = () => {
        this.active = null;
      };

      sketch.mouseClicked = () => {
        if (
          sketch.mouseX >= 25 &&
          sketch.mouseX <= 55 &&
          sketch.mouseY >= 5 &&
          sketch.mouseY <= 35
        ) {
          this.resultArray.push(new Block("ellipse", 100, 20, 30, 30));
        } else if (
          sketch.mouseX >= 25 &&
          sketch.mouseX <= 55 &&
          sketch.mouseY >= 50 &&
          sketch.mouseY <= 80
        ) {
          this.resultArray.push(new Block("rectangle", 85, 50, 30, 30));
        }
      };
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
    justify-content: center;
    align-items: center;

    font-family: "IBM Plex Mono", "IBM Plex Sans", monospace;
  }

  .canvas-pane {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
}
</style>
