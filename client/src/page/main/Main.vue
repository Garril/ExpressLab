<script setup>
import { ref, computed } from "vue";

// props 是通过 defineProps() 来定义的
const props = defineProps({
  msg: {
    tyep: String,
    required: true,
    default: "Hello, I am default",
  },
});
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>Welcome to the Main page!</p>
</template>

<style scoped></style>
