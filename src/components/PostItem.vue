<script setup lang="ts">
import type Post from "@/types/Post";

defineProps<{ post: Post }>();
</script>

<template>
  <article>
    <h2>{{ post.title }}</h2>
    <p>{{ post.author }}</p>
    <p>{{ post.content }}</p>
  </article>
</template>
