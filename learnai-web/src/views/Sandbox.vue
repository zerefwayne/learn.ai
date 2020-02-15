<template>
  <div class="app-sandbox">
    <div class="option-pane">
      Hello
    </div>
    <div class="canvas-pane">
      <canvas id="sandbox-canvas" ref="sandboxcanvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sandbox",
  data() {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        context: null
      }
    };
  },
  provide() {
    return {
      provider: this.provider
    };
  },
  mounted() {
    this.provider.context = this.$refs["sandboxcanvas"].getContext("2d");

    this.$refs["sandboxcanvas"].width = this.$refs["sandboxcanvas"].parentElement.clientWidth / 2;
    this.$refs["sandboxcanvas"].height = this.$refs["sandboxcanvas"].parentElement.clientHeight / 2;
    this.$refs["sandboxcanvas"].fillstyle = "white";
    
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

    position: relative;
  }
}

</style>
