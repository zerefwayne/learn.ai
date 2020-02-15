<template>
  <div id="app">
    <Header></Header>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  components: { Header }
};
</script>

<style lang="scss">
#app {
}
</style>
