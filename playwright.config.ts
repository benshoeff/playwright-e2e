import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.test.ts',
    reporter: [
        ['html', { open: 'never' }],
        ['./reporter/dashboard-reporter.js'],
    ],
    use: {
        headless: !!process.env.CI,
        viewport: { width: 1280, height: 900 },
        launchOptions: {
            slowMo: process.env.CI ? 0 : 800,
        },
    },
    projects: [
        {
            name: 'local',
            use: {
                baseURL: 'http://localhost:3001',
            },
        },
        {
            name: 'production',
            use: {
                baseURL: 'https://qa-sandbox-app.vercel.app/',
            },
        },
    ],
});