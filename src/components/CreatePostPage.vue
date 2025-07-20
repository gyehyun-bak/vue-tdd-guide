<script setup lang="ts">
import { createPost } from "@/api/post.api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const author = ref("");
const title = ref("");
const content = ref("");

const onSaveClick = async () => {
  if (!author.value || !title.value || !content.value) return;

  await createPost({
    author: author.value,
    title: title.value,
    content: content.value,
  });

  router.push("/posts");
};

const onCancelClick = () => {
  router.push("/posts");
};
</script>

<template>
  <div>
    <input data-testid="author-input" v-model="author" />
    <input data-testid="title-input" v-model="title" />
    <textarea data-testid="content-input" v-model="content" />

    <button data-testid="save-button" @click="onSaveClick">저장</button>
    <button data-testid="cancel-button" @click="onCancelClick">취소</button>
  </div>
</template>
