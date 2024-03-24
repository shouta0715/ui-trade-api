/// <reference types="vitest" />
import { configDefaults, defineConfig } from "vitest/config";

const alias = {
  "@": `${__dirname}/src`,
};

export default defineConfig({
  test: {
    globals: true,
    include: ["./src/**/*.test.{ts,tsx}"],
    coverage: {
      all: false,
      provider: "v8",
      reporter: ["html", "text", "json"],
      reportsDirectory: "./coverage",
      exclude: ["**/node_modules/**"],
    },
    exclude: [...configDefaults.exclude, "*.config.{ts,js,tsx}"],
  },
  resolve: { alias },
});
