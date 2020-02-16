<template>
  <nav
    :class="
      !is_sandbox
        ? 'navbar navbar-expand-lg course-style'
        : 'navbar navbar-expand-lg sandbox-style'
    "
  >
    <div class="nav-left">
      <router-link :to="{ name: 'Home' }" tag="a" class="mr-3">
        <img v-if="!is_sandbox" src="@/assets/logo_blue.svg" height="30px" />
        <img v-if="is_sandbox" src="@/assets/logo_orange.svg" height="30px" />
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
          <router-link
            :to="{ name: 'Course' }"
            tag="li"
            class="nav-item"
            active-class="active"
          >
            <a class="nav-link" href="#">Course</a>
          </router-link>
          <router-link
            :to="{ name: 'Sandbox' }"
            tag="li"
            class="nav-item"
            active-class="active"
          >
            <a class="nav-link" href="#">Sandbox</a>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="nav-right">
      <img src="@/assets/hooman.svg" height="30px" />
    </div>
  </nav>
</template>

<script>
export default {
  name: "app-header",
  data() {
    return {
      is_sandbox: false
    };
  },
  mounted() {
    this.is_sandbox = this.$route.name === "Sandbox";
  },
  watch: {
    $route(to) {
      this.is_sandbox = to.name === "Sandbox";
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #ffffff;
  height: 6vh;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 2rem;

  transition: all 200ms ease-in-out;

  .nav-left {
    display: flex;
    align-items: center;
  }
}

.course-style {
  background-color: #ffffff;
  border-bottom: 2px solid #dcdcdc;
  padding: 0 21rem;

  .active {
    a.nav-link {
      color: #6d45e2;
    }
  }

  .nav-item {
    a {
      color: gray;
      font-weight: 500;
    }
    margin-left: 0.4rem;
  }
}

.sandbox-style {
  background-color: #2e2e2e;
  border-bottom: 2px solid #f68000;
  padding: 0 2rem;

  .active {
    a.nav-link {
      color: #f68000;
    }
  }

  .nav-item {
    a {
      color: white;
      font-weight: 500;
    }
    margin-left: 0.4rem;
  }
}
</style>
