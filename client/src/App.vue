<script setup>
import { onMounted } from "vue";
import useStore from "./store/index";
const { login: loginStore } = useStore();
import { storeToRefs } from "pinia";
import { getUserInfo } from "./service/loginService";

const { data: userInfo } = storeToRefs(loginStore);

const loginOut = () => {
  loginStore.loginOut();
};

import { useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    getUserInfo().then((res) => {
      userInfo.value.loginId = res.data.loginId;
      router.push({ name: "Main", query: { msg: "Auto Login" } });
    });
  }
});
</script>

<template>
  <nav class="tablist">
    <router-link :to="{ path: '/', query: { msg: 'Hello, Dear User!' } }"
      >Home</router-link
    >
    <template v-if="userInfo && userInfo.loginId">
      <a href="#">{{ userInfo.loginId }}</a>
      <button @click="loginOut">注销</button>
    </template>
    <router-link v-else to="/login">Login</router-link>
    <router-link to="/file">文件</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
.tablist {
  display: flex;
  gap: 30px;
}
</style>
