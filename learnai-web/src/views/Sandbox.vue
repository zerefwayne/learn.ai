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
import sketch from "@/assets/sketch.js";

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
      }
    };
  },
  methods: {
    s(sketch) {
      sketch.setup = () => {
        sketch.createCanvas(this.provider.width, this.provider.height);

        sketch.draw = () => {
          sketch.background(0);
          sketch.fill(255);
          sketch.rect(0, 0, 50, 50);
        };
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

    console.log("MyP5", myp5);

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
