import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3123);

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
