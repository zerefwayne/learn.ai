<template>
  <div class="app-course">
    <div class="course-content">
      <div class="lesson-pane">
        Lessons
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
    background-color: #eeeeee;
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
</style>
