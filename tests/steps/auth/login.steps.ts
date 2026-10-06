import { expect } from '@playwright/test';
import { CREDENTIALS, AUTH_MESSAGES } from '../../constants';
import { createBdd } from 'playwright-bdd';


const { Given, When, Then } = createBdd();

Given('the user is on the login page', async ({ page }) => {
    await page.goto(process.env.BASE_URL || '/', {
        waitUntil: 'networkidle',
    });

    const usernameInput = page.locator('input[name="username"]');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
});

// --- WHEN: Entering Credentials ---
When('the user enters valid username and valid password', async ({ page }) => {
    await page.locator('input[name="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('input[name="password"]').fill(CREDENTIALS.VALID_USER.password);
});

When('the user enters invalid username and invalid password', async ({ page }) => {
    await page.locator('input[name="username"]').fill(CREDENTIALS.INVALID_USER.username);
    await page.locator('input[name="password"]').fill(CREDENTIALS.INVALID_USER.password);
});

When('the user enters invalid username and valid password', async ({ page }) => {
    await page.locator('input[name="username"]').fill(CREDENTIALS.INVALID_USER.username);
    await page.locator('input[name="password"]').fill(CREDENTIALS.VALID_USER.password);
});

When('the user enters valid username and invalid password', async ({ page }) => {
    await page.locator('input[name="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('input[name="password"]').fill(CREDENTIALS.INVALID_USER.password);
});

When('the user enters empty username and empty password', async ({ page }) => {
    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();
});

When('the user enters empty username and valid password', async ({ page }) => {
    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').fill(CREDENTIALS.VALID_USER.password);
});

When('the user enters valid username and empty password', async ({ page }) => {
    await page.locator('input[name="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('input[name="password"]').clear();
});

When('clicks the login button', async ({ page }) => {
    const loginBtn = page.locator('button[type="submit"]');
    await loginBtn.waitFor({ state: 'visible', timeout: 10000 });
    await loginBtn.click();
});

// --- WHEN: Forgot Password ---
When('the user clicks the forgot password link', async ({ page }) => {
    const forgotLink = page.locator('a:has-text("Forgot your password"), .orangehrm-login-forgot, a[href*="requestPasswordResetCode"]');

    await forgotLink.waitFor({ state: 'visible', timeout: 10000 });
    await forgotLink.click();
});

When('the user enters valid email address', async ({ page }) => {
    const emailInput = page.locator('input[name="username"], input[name="email"]');

    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(CREDENTIALS.VALID_USER.username);
});

When('the user enters invalid email address', async ({ page }) => {
    const emailInput = page.locator('input[name="username"], input[name="email"]');

    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(CREDENTIALS.INVALID_USER.username);
});

When('the user enters empty email address', async ({ page }) => {
    const emailInput = page.locator('input[name="username"], input[name="email"]');

    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.clear();
});

When('clicks the reset password button', async ({ page }) => {
    const resetButton = page.locator('button[type="submit"]:has-text("Reset Password")');

    await resetButton.waitFor({ state: 'visible', timeout: 10000 });

    const responsePromise = page.waitForResponse(
        (response) => response.url().includes('requestPasswordResetCode') || response.status() === 200,
        { timeout: 15000 }
    ).catch(() => null);

    await resetButton.click();
    await responsePromise;
});

When('clicks the cancel button', async ({ page }) => {
    const cancelButton = page.locator('button:has-text("Cancel")');

    await cancelButton.waitFor({ state: 'visible', timeout: 10000 });
    await cancelButton.click();
});

// --- THEN: Assertions ---
Then('the user should be redirected to the dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/);
});

Then('the user should not be redirected to the dashboard', async ({ page }) => {
    await expect(page).not.toHaveURL(/.*dashboard/);
});

Then('the user should see an error message', async ({ page }) => {
    const errorElement = page.locator('.oxd-alert-content, .error-message, [data-test="error"], .oxd-input-field-error-message');
    await expect(errorElement.first()).toBeVisible();
});

Then('the user should be redirected to the password reset page', async ({ page }) => {
    await page.waitForURL(/.*(sendPasswordReset|requestPasswordResetCode).*/, { timeout: 15000 });

    const successHeader = page.locator('.orangehrm-forgot-password-title, h6');
    await expect(successHeader.first()).toBeVisible({ timeout: 10000 });
});

Then('the user should be redirected to the login page', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
});

Then('the user should see an invalid credential error message', async ({ page }) => {
    const errorAlert = page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text');

    await errorAlert.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorAlert.first()).toContainText(AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
});

Then('the user should see required error message', async ({ page }) => {
    const errorAlert = page.locator('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message');

    await expect(errorAlert.first()).toBeVisible();
    await expect(errorAlert.first()).toContainText(AUTH_MESSAGES.ERROR.REQUIRED);
});