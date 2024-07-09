<script setup>
import { ref, computed } from "vue";
import useStore from "../../store/index";
import { storeToRefs } from "pinia";

import { useRouter } from "vue-router";
const router = useRouter();

// 从 store 中获取 loginStore 实例
const { login: loginStore } = useStore();
// 使用 computed 来获取响应式数据
const { data, isLoading } = storeToRefs(loginStore);

// 定义登录、登出和获取用户信息的方法
const loginId = ref("admin");
const loginPwd = ref("123456");

const loginIn = () => {
  const result = loginStore.loginIn(loginId.value, loginPwd.value);
  result.then((res) => {
    if (res) {
      router.push({ path: "/", query: { msg: "Login Success!" } });
    }
  });
};

const loginOut = () => {
  loginStore.loginOut();
};

const getUserInfo = () => {
  loginStore.getUserInfo();
};
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-if="data">{{ data }}</div>
      <div v-else>No data available</div>
    </div>
    <div>
      <label for="loginId">Account:</label>
      <input id="loginId" v-model="loginId" placeholder="Enter your account" />
    </div>
    <div>
      <label for="loginPwd">Password:</label>
      <input
        id="loginPwd"
        type="password"
        v-model="loginPwd"
        placeholder="Enter your password"
      />
      <!-- 不想密码被自动填写：authcomplete="new-password" -->
    </div>
    <button @click="loginIn">Login</button>
    <button @click="loginOut">Logout</button>
    <button @click="getUserInfo">Get User Info</button>
  </div>
</template>

<style scoped></style>
