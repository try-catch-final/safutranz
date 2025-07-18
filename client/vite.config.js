import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import vitePostcssHelper from 'vite-postcss-helper';

export default defineConfig({
    plugins: [react(), vitePostcssHelper()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: { '@base-color': '#f44336' }
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            }
        }
    },
    define: {
        'process.env': {},
        global: 'globalThis'
    },
    server: {
        host: '0.0.0.0',
        port: 4000,
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            'safutranz.com',
            'www.safutranz.com',
            '.safutranz.com',
            'all'
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false
            }
        },
        // Disable HMR in production to prevent reload issues
        hmr: process.env.NODE_ENV === 'development' ? {
            port: 4000,
            host: '0.0.0.0'
        } : false
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    }
}); 