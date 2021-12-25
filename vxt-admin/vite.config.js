import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue()
    ],
    server: {
        port: 4040,
        open: true,
        hmr: {
            overlay: false
        }
    }
})
