import { createPinia } from 'pinia';
import { useLoginStore } from './loginUser';


// 注册所有的 Pinia 模块
export default function useStore() {
  return {
    login: useLoginStore(),
  }
}