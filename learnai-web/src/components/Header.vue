<template>
  <nav class="navbar navbar-expand-lg">
    <div class="nav-left">
      <router-link :to="{ name: 'Home' }" tag="a">
        <div>Learn.ai</div>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <router-link :to="{ name: 'Course' }" tag="li" class="nav-item">
            <a class="nav-link" href="#">Course</a>
          </router-link>
          <router-link :to="{ name: 'Sandbox' }" tag="li" class="nav-item">
            <a class="nav-link" href="#">Sandbox</a>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="nav-right">
      Hello
    </div>
  </nav>
</template>

<script>
export default {
  name: "app-header"
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #ffeeee;
  height: 6vh;
  

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 15rem;

  .nav-left {
    display: flex;
    align-items: center;
  }
}
</style>
