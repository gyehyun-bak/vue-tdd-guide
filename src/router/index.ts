import PostsPage from "@/components/PostsPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "posts",
      component: PostsPage,
    },
  ],
});

export default router;
