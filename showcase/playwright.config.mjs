import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5181/showcase/',
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5181',
    port: 5181,
    reuseExistingServer: !process.env.CI,
  },
});
