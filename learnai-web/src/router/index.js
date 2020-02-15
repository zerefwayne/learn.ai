import Vue from "vue";
import VueRouter from "vue-router";
import Course from "@/views/Course.vue";
import Sandbox from "@/views/Sandbox.vue";

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
    path: "/sandbox",
    name: "Sandbox",
    component: Sandbox
  }
];

const router = new VueRouter({
  routes
});

export default router;
