import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

const getEmployeeRow = (page: any, employeeName: string) => {
    return page.locator('.oxd-table-card').filter({
        has: page.locator('.oxd-table-cell', { hasText: employeeName }),
    });
};

Then('a {string} message should be displayed', async ({ page }, expectedMessage: string) => {
    const noRecordToastOrSpan = page.locator('.oxd-text--span', { hasText: expectedMessage })
        .or(page.locator('span', { hasText: expectedMessage }));

    await expect(noRecordToastOrSpan.first()).toBeVisible({ timeout: 5000 });
});

When('the user clicks the delete icon for employee {string}', async ({ page }, employeeName: string) => {
    await page.evaluate(() => {
        document.body.style.zoom = '60%';
    });

    const employeeRow = page.locator('.oxd-table-body .oxd-table-card').filter({
        hasText: employeeName,
    });

    await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });

    const deleteButton = employeeRow.first().locator('.bi-trash');
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click({ force: true });


    await page.evaluate(() => {
        document.body.style.zoom = '100%';
    });
});

When('the user confirms deleting the employee', async ({ page }) => {
    const modal = page.getByRole('dialog').or(
        page.locator('.oxd-dialog-container').filter({
            has: page.locator('p, h6', { hasText: 'Are you Sure?' })
        })
    );

    await modal.waitFor({ state: 'visible', timeout: 5000 });

    const confirmBtn = modal.locator('button', { hasText: 'Yes, Delete' });
    await confirmBtn.click();
    await page.waitForTimeout(300);
});

When('the user cancels deleting the employee', async ({ page }) => {
    const modal = page.getByRole('dialog').or(
        page.locator('.oxd-dialog-container').filter({
            has: page.locator('p, h6', { hasText: 'Are you Sure?' })
        })
    );

    await modal.waitFor({ state: 'visible', timeout: 5000 });

    const cancelBtn = modal.locator('button', { hasText: 'Cancel' });
    await cancelBtn.click();
    await page.waitForTimeout(300);
});

Then('the employee {string} should be displayed in the employee list', async ({ page }, employeeName: string) => {
    await page.evaluate(() => {
        document.body.style.zoom = '60%';
    });
    await expect(getEmployeeRow(page, employeeName).first()).toBeVisible({ timeout: 5000 });
});