import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('the user is logged in as ESS', async ({ page }) => {
    const baseUrl = process.env.BASE_URL!;
    const username = process.env.ESS_USERNAME!;
    const password = process.env.ESS_PASSWORD!;

    const url = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    await page.goto(`${url}web/index.php/auth/login`);

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/dashboard/index');
});

Then('the {string} menu should not be visible in the sidebar navigation', async ({ page }, menuName: string) => {
    const adminMenu = page.locator('.oxd-main-menu-item').filter({ hasText: menuName });

    await expect(adminMenu).not.toBeVisible();
});

When('the user attempts to access the Admin URL directly', async ({ page }) => {
    const envUrl = process.env.BASE_URL!;
    const baseUrl = envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
    await page.goto(`${baseUrl}web/index.php/admin/viewSystemUsers`, {
        waitUntil: 'networkidle',
    });
});

Then('the user should be redirected away from Admin page', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const isRedirected = !page.url().includes('/admin/viewSystemUsers');

    if (isRedirected) {
        expect(isRedirected).toBeTruthy();
    } else {
        const adminTable = page.locator('.orangehrm-container, .oxd-table');
        const accessDeniedMessage = page.locator('text=/Credential required/i');
        const isAccessBlocked = (await accessDeniedMessage.isVisible().catch(() => false)) ||
            !(await adminTable.isVisible().catch(() => false));

        expect(isAccessBlocked).toBeTruthy();
    }
});

Then('the "Add Employee" button should not be displayed', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add' })
        .or(page.locator('a', { hasText: 'Add Employee' }));

    await expect(addBtn).not.toBeVisible();
});

Then('the delete employee icon should not be displayed in the list', async ({ page }) => {
    const deleteIcon = page.locator('.bi-trash');
    await expect(deleteIcon).not.toBeVisible();
});

When('the ESS user navigates to the {string} page', async ({ page }, pageName: string) => {
    const envUrl = process.env.BASE_URL!;
    const baseUrl = envUrl.endsWith('/') ? envUrl : `${envUrl}/`;

    if (pageName === 'PIM') {
        const pimSidebar = page.locator('.oxd-main-menu-item').filter({ hasText: /PIM|My Info/i }).first();

        if (await pimSidebar.isVisible().catch(() => false)) {
            await pimSidebar.click();
        } else {
            await page.goto(`${baseUrl}web/index.php/pim/viewEmployeeList`, {
                waitUntil: 'domcontentloaded',
            });
        }
    } else {
        await page.locator(`a:has-text("${pageName}"), button:has-text("${pageName}")`).first().click();
    }

    await page.waitForLoadState('domcontentloaded');
});