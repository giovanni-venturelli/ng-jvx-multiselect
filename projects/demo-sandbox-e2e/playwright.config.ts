import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

// The demo is served over https with the self-signed certificate of the Angular dev server.
const baseURL = process.env['BASE_URL'] || 'https://localhost:4300';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  // The mock backend (projects/mock-server) and the demo, the same pair started by `npm start`.
  webServer: [
    {
      command: 'node projects/mock-server/server.js',
      url: 'http://localhost:3000/jvx-multiselect-test/list',
      reuseExistingServer: true,
      timeout: 30_000,
      cwd: workspaceRoot,
    },
    {
      command: 'npx nx serve demo-sandbox --port 4300 --ssl true',
      url: baseURL,
      ignoreHTTPSErrors: true,
      reuseExistingServer: true,
      timeout: 180_000,
      cwd: workspaceRoot,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
