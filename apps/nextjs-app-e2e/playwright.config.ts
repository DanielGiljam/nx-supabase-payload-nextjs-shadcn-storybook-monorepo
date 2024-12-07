import {workspaceRoot} from "@nx/devkit";
import {nxE2EPreset} from "@nx/playwright/preset";
import {defineConfig, devices} from "@playwright/test";

// For CI, you may want to set BASE_URL to the deployed application.
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions -- "or" works better in this case where we also want to take the fallback in case BASE_URL is empty string
const baseURL = process.env.BASE_URL || "http://localhost:3000";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    ...nxE2EPreset(__filename, {testDir: "./src"}),
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
    },
    /* Run your local dev server before starting the tests */
    webServer: {
        command: "pnpm exec nx run nextjs-app:start",
        url: "http://localhost:3000",
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- un-strictness here is better
        reuseExistingServer: !process.env.CI,
        cwd: workspaceRoot,
    },
    projects: [
        {
            name: "chromium",
            use: {...devices["Desktop Chrome"]},
        },

        {
            name: "firefox",
            use: {...devices["Desktop Firefox"]},
        },

        {
            name: "webkit",
            use: {...devices["Desktop Safari"]},
        },

        // Uncomment for mobile browsers support
        /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

        // Uncomment for branded browsers
        /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
    ],
});
