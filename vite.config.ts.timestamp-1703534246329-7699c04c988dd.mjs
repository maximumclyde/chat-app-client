// vite.config.ts
import { defineConfig } from "file:///C:/Users/User/OneDrive/Desktop/Projects/ChatApp/chat-app-client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/User/OneDrive/Desktop/Projects/ChatApp/chat-app-client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\User\\OneDrive\\Desktop\\Projects\\ChatApp\\chat-app-client";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "src"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@redux-types": path.resolve(__vite_injected_original_dirname, "./src/store/types"),
      "@authenticated-routes": path.resolve(
        __vite_injected_original_dirname,
        "./src/components/AuthenticatedRoutes"
      ),
      "@unauthenticated-routes": path.resolve(
        __vite_injected_original_dirname,
        "./src/components/UnauthenticatedRoutes"
      ),
      "@ui-components": path.resolve(
        __vite_injected_original_dirname,
        "./src/components/UIComponents"
      ),
      "@assets": path.resolve(__vite_injected_original_dirname, "./src/assets"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@store-actions": path.resolve(__vite_injected_original_dirname, "./src/store/storeActions")
    }
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcUHJvamVjdHNcXFxcQ2hhdEFwcFxcXFxjaGF0LWFwcC1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzZXJcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxQcm9qZWN0c1xcXFxDaGF0QXBwXFxcXGNoYXQtYXBwLWNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXNlci9PbmVEcml2ZS9EZXNrdG9wL1Byb2plY3RzL0NoYXRBcHAvY2hhdC1hcHAtY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiflwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICAgIFwiQHR5cGVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvdHlwZXNcIiksXG4gICAgICBcIkByZWR1eC10eXBlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3N0b3JlL3R5cGVzXCIpLFxuICAgICAgXCJAYXV0aGVudGljYXRlZC1yb3V0ZXNcIjogcGF0aC5yZXNvbHZlKFxuICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgIFwiLi9zcmMvY29tcG9uZW50cy9BdXRoZW50aWNhdGVkUm91dGVzXCJcbiAgICAgICksXG4gICAgICBcIkB1bmF1dGhlbnRpY2F0ZWQtcm91dGVzXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICBcIi4vc3JjL2NvbXBvbmVudHMvVW5hdXRoZW50aWNhdGVkUm91dGVzXCJcbiAgICAgICksXG4gICAgICBcIkB1aS1jb21wb25lbnRzXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICBcIi4vc3JjL2NvbXBvbmVudHMvVUlDb21wb25lbnRzXCJcbiAgICAgICksXG4gICAgICBcIkBhc3NldHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9hc3NldHNcIiksXG4gICAgICBcIkB1dGlsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3V0aWxzXCIpLFxuICAgICAgXCJAaG9va3NcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9ob29rc1wiKSxcbiAgICAgIFwiQHN0b3JlLWFjdGlvbnNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zdG9yZS9zdG9yZUFjdGlvbnNcIiksXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStYLFNBQVMsb0JBQW9CO0FBQzVaLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ2xDLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLG1CQUFtQjtBQUFBLE1BQzNELHlCQUF5QixLQUFLO0FBQUEsUUFDNUI7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsMkJBQTJCLEtBQUs7QUFBQSxRQUM5QjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxrQkFBa0IsS0FBSztBQUFBLFFBQ3JCO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFdBQVcsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNqRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLGtCQUFrQixLQUFLLFFBQVEsa0NBQVcsMEJBQTBCO0FBQUEsSUFDdEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ25CLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
