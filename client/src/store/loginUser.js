import { defineStore } from "pinia";
import * as loginService from "../service/loginService";

export const useLoginStore = defineStore('login', {
  state: () => ({
    data: {
      loginId: null
    },
    isLoading: false,
  }),
  actions: {
    async loginIn(loginId, loginPwd) {
      this.isLoading = true;
      try {
        const res = await loginService.loginIn(loginId, loginPwd);
        this.data = res.data; // 直接修改 state 中的 data
      } catch (error) {
        console.error("Login error:", error);
        // 可以在这里处理登录错误
      } finally {
        this.isLoading = false;
      }
      return this.data;
    },
    async loginOut() {
      this.data = null;
      loginService.loginOut();
    },
    async getUserInfo() {
      this.isLoading = true;
      try {
        const res = await loginService.getUserInfo();
        this.data = res.data; // 直接修改 state 中的 data
      } catch (error) {
        console.error("Get user info error:", error);
        this.data = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
