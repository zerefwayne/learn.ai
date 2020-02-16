<template>
  <div class="lesson-1">
    <div class="course-content">
      <h1 style="font-weight: 300; text-align:center;" class="mb-5">
        An insight into classification algorithms
      </h1>
      <img
        src="@/assets/knn1.png"
        class="mb-5"
        style="margin-bottom: 5rem;"
        width="70%"
      />
      <div class="text-content mb-3">
        Hi there!
      </div>
      <div class="text-content mb-4">
        You must have heard about the terms machine learning and deep learning
        floating around the news, claiming to usher in a new era of
        technological revolution and thought why not try a hand at it. Well, if
        that’s the case you have come to the perfect place!
      </div>
      <div class="text-content mb-4">
        These series of lessons will allow you to learn about all the basic
        concepts of ML without all those pesky “python” coding and ever so
        annoying bugs! In this lesson we will implement a neural network that
        will be able to multiply any given number by 2, all through the power of
        ML!
      </div>
      <div class="text-content mb-4">
        Oh, that doesn’t seem so world changing, but believe us, this will lay
        foundations to the fundamental concepts of all learning algorithms.
      </div>
      <div class="text-content mb-4">
        PS: Not a novice? Check out our playground feature, and construct a
        modular network in a jiffy!
      </div>
      <h2
        style="font-weight: 300; text-align:left; width: 90%;"
        class="mt-4 mb-5"
      >
        ML: A Functional Approach
      </h2>
      <div class="text-content mb-4">
        Let’s get something very clear, all this ML isn’t black magic it’s just
        the following short mathematical concept:
      </div>
      <div class="text-content mb-4">
        That’s it! X is our input and Y’ is our not-so-magical model. It’s just
        a mathematical function. What’s a function you ask? All it is that, you
        plug in some numbers to f(.) and you’ll get a Y which is logically
        related to X, say, Y = 2 * X. Wait! That’s what we want to do!
      </div>
      <div class="text-content mb-4">
        So, this entire fuss about Machine Learning is finding this logical
        relation between the input and output.
      </div>
      <div
        class="text-content mt-3 mb-4"
        style="display:flex; justify-content: flex-end;"
      >
        <router-link :to="{ name: 'Classification' }" class="btn btn-primary"
          >Continue</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lesson2"
};
</script>

<style lang="scss" scoped>
.lesson-1 {
  display: flex;
  justify-content: center;

  .course-content {
    margin-top: 3rem;
    margin-bottom: 3rem;
    background-color: white;
    width: 65%;
    box-shadow: 0px 0px 10px #e7e7e7;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 3rem;
  }

  .text-content {
    text-align: left;
    width: 90%;
    font-size: 1.3rem;
    font-family: "IBM Plex Serif", serif;
  }
}
</style>
