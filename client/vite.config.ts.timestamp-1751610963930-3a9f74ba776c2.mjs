// vite.config.ts
import { defineConfig } from "file:///root/work/safutranz/client/node_modules/vite/dist/node/index.js";
import react from "file:///root/work/safutranz/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/root/work/safutranz/client";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: { "@base-color": "#f44336" }
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  define: {
    "process.env": {},
    global: "globalThis"
  },
  server: {
    host: "0.0.0.0",
    port: 4e3,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "safutranz.com",
      "www.safutranz.com",
      ".safutranz.com",
      "all"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvcm9vdC93b3JrL3NhZnV0cmFuei9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9yb290L3dvcmsvc2FmdXRyYW56L2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vcm9vdC93b3JrL3NhZnV0cmFuei9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIGNzczoge1xuICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9kaWZ5VmFyczogeyAnQGJhc2UtY29sb3InOiAnI2Y0NDMzNicgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICBsb2FkZXI6IHtcbiAgICAgICAgICAgICAgICAnLmpzJzogJ2pzeCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAgICdwcm9jZXNzLmVudic6IHt9LFxuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJ1xuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgICAgcG9ydDogNDAwMCxcbiAgICAgICAgYWxsb3dlZEhvc3RzOiBbXG4gICAgICAgICAgICAnbG9jYWxob3N0JyxcbiAgICAgICAgICAgICcxMjcuMC4wLjEnLFxuICAgICAgICAgICAgJ3NhZnV0cmFuei5jb20nLFxuICAgICAgICAgICAgJ3d3dy5zYWZ1dHJhbnouY29tJyxcbiAgICAgICAgICAgICcuc2FmdXRyYW56LmNvbScsXG4gICAgICAgICAgICAnYWxsJ1xuICAgICAgICBdLFxuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVEsU0FBUyxvQkFBb0I7QUFDaFMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUZ4QixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsS0FBSztBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDakIsTUFBTTtBQUFBLFFBQ0YsbUJBQW1CO0FBQUEsUUFDbkIsWUFBWSxFQUFFLGVBQWUsVUFBVTtBQUFBLE1BQzNDO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDakM7QUFBQSxFQUNKO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNKLE9BQU87QUFBQSxNQUNYO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLGVBQWUsQ0FBQztBQUFBLElBQ2hCLFFBQVE7QUFBQSxFQUNaO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0gsUUFBUTtBQUFBLFFBQ0osUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ1gsT0FBTztBQUFBLFFBQ0gsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUN6QztBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
