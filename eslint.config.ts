import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node }, // ✅ mejor Node en tu API
  },
  tseslint.configs.recommended,
  {
    rules: {
      // 🔥 Esto te marcará cuando falte un await en promesas
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
]);
