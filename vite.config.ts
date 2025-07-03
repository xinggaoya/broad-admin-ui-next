import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 自动导入API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      dts: true, // 生成类型声明文件
      dirs: ['src/composables', 'src/stores'], // 自动导入自定义函数
    }),
    // 自动导入组件
    Components({
      resolvers: [NaiveUiResolver()],
      dts: true, // 生成类型声明文件
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
