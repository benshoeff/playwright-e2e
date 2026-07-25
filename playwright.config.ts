import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.test.ts',
    reporter: 'html',
    use: {
        headless: !!process.env.CI,
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