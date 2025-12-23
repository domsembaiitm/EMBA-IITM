import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {
    test('should display login form with tabs', async ({ page }) => {
        await page.goto('/login');

        // Check Title
        await expect(page.getByText('Executive Cohort')).toBeVisible();

        // Check Tabs
        await expect(page.getByRole('tab', { name: 'Student' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Recruiter' })).toBeVisible();

        // Check Student Form default
        await expect(page.getByPlaceholder('student@university.edu')).toBeVisible();

        // Switch to Recruiter
        await page.getByRole('tab', { name: 'Recruiter' }).click();
        await expect(page.getByPlaceholder('recruiter@company.com')).toBeVisible();
    });
});
