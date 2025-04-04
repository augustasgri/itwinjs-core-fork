import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import * as packageJson from "./package.json";

const includePackages: string[] = Object.entries(packageJson.peerDependencies)
  .filter(([_, version]) => version === "workspace:*")
  .map(([pkgName]) => pkgName);

export default defineConfig({
  esbuild: {
    target: "es2022",
  },
  test: {
    dir: "src/test",
    setupFiles: "./src/test/setupTests.ts",
    // include: ["**/filename.test.ts"], // to honor it/describe.only
    testTimeout: 80000, // Some tests can take much longer than the default 5 seconds when run in parallel.
    minWorkers: 1,
    // our tests share resources and hence running them in parallel can cause issues.
    maxWorkers: 1,
    coverage: {
      provider: "v8",
      include: [
        "src/**/*"
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "src/test/**/*",
        "**/*.d.ts",
        "**/*.d.tsx"
      ],
      reporter: [
        "text-summary",
        "lcov",
        "cobertura"
      ],
      reportsDirectory: "./lib/esm/test/coverage",
      thresholds: { // This should not be in the default config file.
        branches: 70,
        statements: 85,
        functions: 85,
        lines: 85
      }
    },
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
  optimizeDeps: {
    include: includePackages,
    force: true,
  }
})
