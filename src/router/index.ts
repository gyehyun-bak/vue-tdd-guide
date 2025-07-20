import CreatePostPage from "@/components/CreatePostPage.vue";
import PostsPage from "@/components/PostsPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/posts",
      name: "posts",
      component: PostsPage,
    },
    {
      path: "/posts/create",
      name: "createPost",
      component: CreatePostPage,
    },
  ],
});

export default router;
