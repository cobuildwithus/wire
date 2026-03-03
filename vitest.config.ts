import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts", "**/*.d.ts"],
      thresholds: {
        perFile: true,
        lines: 70,
        functions: 90,
        branches: 60,
        statements: 70
      }
    }
  }
});
