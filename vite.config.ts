import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteSingleFile } from "vite-plugin-singlefile"; // <-- Import the new plugin

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [react(), viteSingleFile(), mode === "development" && componentTagger()].filter(Boolean),
    base: "./", // <-- Add this line
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
