import Vue from "vue";
import VueRouter from "vue-router";
import Course from "@/views/Course.vue";
import Sandbox from "@/views/Sandbox.vue";
import Lesson1 from "@/views/Lesson1.vue";
import Lesson2 from "@/views/Lesson2.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: { name: "Course" }
  },
  {
    path: "/course",
    name: "Course",
    component: Course
  },
  {
    path: "/course/introduction",
    name: "Introduction",
    component: Lesson1
  },
  {
    path: "/course/classification",
    name: "Classification",
    component: Lesson2
  },
  {
    path: "/sandbox",
    name: "Sandbox",
    component: Sandbox
  }
];

const router = new VueRouter({
  routes
});

export default router;
