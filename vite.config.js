import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "src")
      }
    },
    build: {
      outDir: "dist"
    },
    base: "./",
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import "./src/assets/css/common.less";`,
          },
          javascriptEnabled: true
        },
      },
    },
    esbuild: {
      charset: 'ascii'
    },
    server: {
      https: false,
      prot: 8088,
      proxy: {
        '/web-api': {
          target: 'http://zkqh.kmdns.net:0000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/web-api/, '')
        },
        '/file_remote': {
          target: 'http://zkqh.kmdns.net:0000/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/file_remote/, '')
        }
      }
    }
  }
})




