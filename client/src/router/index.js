// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Login from "../page/login/Login.vue";
import Main from "../page/main/Main.vue";
import File from "../page/file/File.vue";

import useStore from '../store/index';

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    props: route => ({ msg: route.query.msg })
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: '/file',
    name: 'File',
    component: File,
    beforeEnter: (to, from, next) => {
      const { login: loginStore } = useStore();
      if (loginStore.data && loginStore.data.loginId) {
        next();
      } else {
        next('/login');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
