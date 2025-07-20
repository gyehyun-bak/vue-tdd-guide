<script setup lang="ts">
import { getPosts } from "@/api/post.api";
import type { Post } from "@/types/Post";
import { onMounted, ref } from "vue";
import PostItem from "./PostItem.vue";
import { useRouter } from "vue-router";

const posts = ref<Post[]>([]);
const router = useRouter();

onMounted(async () => {
  const data = await getPosts();
  posts.value = data.posts;
});

const onClick = () => {
  router.push("/posts/create");
};
</script>

<template>
  <div>
    <PostItem v-for="post in posts" :key="post.id" :post="post" />
    <button data-testid="create-post-button" @click="onClick">새 게시물</button>
  </div>
</template>
