import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@redux-types": path.resolve(__dirname, "./src/store/types"),
      "@authenticated-routes": path.resolve(
        __dirname,
        "./src/components/AuthenticatedRoutes"
      ),
      "@unauthenticated-routes": path.resolve(
        __dirname,
        "./src/components/UnauthenticatedRoutes"
      ),
      "@ui-components": path.resolve(
        __dirname,
        "./src/components/UIComponents"
      ),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store-actions": path.resolve(__dirname, "./src/store/storeActions"),
    },
  },
  plugins: [react()],
});
