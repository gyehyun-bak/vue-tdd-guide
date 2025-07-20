<script setup lang="ts">
import { getPosts } from "@/api/post.api";
import type { Post } from "@/types/Post";
import { onMounted, ref } from "vue";
import PostItem from "./PostItem.vue";

const posts = ref<Post[]>([]);

onMounted(async () => {
  const data = await getPosts();
  posts.value = data.posts;
});
</script>

<template>
  <div>
    <PostItem v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>
