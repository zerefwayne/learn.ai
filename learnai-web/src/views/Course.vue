<template>
  <div class="app-course">
    <div class="course-content">
      <div class="lesson-pane">
        <div class="lesson-level">
          <router-link tag="div" :to="{ name: 'Introduction' }" class="lesson-card">
            <img src="@/assets/intro.png" class="mb-3" />
            <h5>1. Welcome!</h5>
          </router-link>
        </div>
        <div class="lesson-level">
          <router-link tag="div" :to="{ name: 'Classification' }" class="lesson-card">
            <img src="@/assets/intro.png" class="mb-3" />
            <h5>2. Classification</h5>
          </router-link>
          <div class="lesson-card">
            <img src="@/assets/regression.svg" class="mb-3" />
            <h5>3. Regression</h5>
          </div>
        </div>
        <div class="lesson-level">
          <div class="lesson-card">
            <img src="@/assets/deep.png" class="mb-3" />
            <h5>4. Deep Learning</h5>
          </div>
        </div>
      </div>
      <div class="extra-pane">
        Scam
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Course"
};
</script>

<style lang="scss" scoped>
.app-course {
  display: flex;
  justify-content: center;

  .course-content {
    margin-top: 3rem;
    background-color: black;
    width: 65%;

    display: flex;
    justify-content: center;
  }

  .lesson-pane {
    background-color: #ffffff;
    padding: 4rem;
    flex: 0 0 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .extra-pane {
    background-color: #e1e1e1;
    padding: 4rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.lesson-level {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 3rem;
}

.lesson-card {
  padding: 2rem 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px #dedede;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
</style>
