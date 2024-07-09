import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:8888",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../public'), // 打包输出到 expresslab/public 文件夹
    assetsDir: '.',      // 将所有静态资源放在 outDir 的根目录
    base: './',          // 在服务器根目录部署时的基本 URL
  },
})
