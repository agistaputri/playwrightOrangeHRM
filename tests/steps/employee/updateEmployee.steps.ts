import { createBdd } from 'playwright-bdd';
import { expect, Page } from '@playwright/test';
import { ADD_EMPLOYEE_MESSAGES, CREDENTIALS } from '../../constants';
import type { DataTable } from '@cucumber/cucumber';
import path from 'path';

const { Given, When, Then } = createBdd();

When('the user fills Personal Details with:', async ({ page }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();
    if (data.firstName) {
        const firstNameInput = page.locator('input[name="firstName"]');
        await firstNameInput.clear();
        await firstNameInput.fill(data.firstName);
    }
    if (data.middleName) {
        const middleNameInput = page.locator('input[name="middleName"]');
        await middleNameInput.clear();
        await middleNameInput.fill(data.middleName);
    }
    if (data.lastName) {
        const lastNameInput = page.locator('input[name="lastName"]');
        await lastNameInput.clear();
        await lastNameInput.fill(data.lastName);
    }
    const getGroup = (label: string) =>
        page.locator('.oxd-input-group', { hasText: label });

    if (data.employeeId) {
        const empIdInput = getGroup('Employee Id').locator('input');
        await empIdInput.clear();
        await empIdInput.fill(data.employeeId);
    }
    if (data.otherId) {
        const otherIdInput = getGroup('Other Id').locator('input');
        await otherIdInput.clear();
        await otherIdInput.fill(data.otherId);
    }

    if (data.driversLicense) {
        const dlInput = getGroup("Driver's License Number").locator('input');
        await dlInput.clear();
        await dlInput.fill(data.driversLicense);
    }
    if (data.licenseExpiry) {
        const expiryInput = getGroup('License Expiry Date').locator('input');
        await expiryInput.clear();
        await expiryInput.fill(data.licenseExpiry);
    }

    if (data.nationality) {
        const nationalityDropdown = getGroup('Nationality').locator('.oxd-select-wrapper');
        await nationalityDropdown.click();
        await page.locator('.oxd-select-option', { hasText: data.nationality }).click();
    }
    if (data.maritalStatus) {
        const maritalDropdown = getGroup('Marital Status').locator('.oxd-select-wrapper');
        await maritalDropdown.click();
        await page.locator('.oxd-select-option', { hasText: data.maritalStatus }).click();
    }

    if (data.dateOfBirth) {
        const dobInput = getGroup('Date of Birth').locator('input');
        await dobInput.clear();
        await dobInput.fill(data.dateOfBirth);
    }

    if (data.gender) {
        const genderLabel = page.locator('.oxd-radio-wrapper label', {
            hasText: new RegExp(`^${data.gender}$`, 'i')
        });
        await genderLabel.waitFor({ state: 'visible', timeout: 5000 });
        await genderLabel.click();
    }
});

When('the user clicks the Save button for Personal Details', async ({ page }) => {
    const saveButton = page.locator('form').first().locator('button[type="submit"]');
    await saveButton.click();
});

Then('a successfully updated message should be displayed', async ({ page }) => {
    const toastMessage = page.locator('.oxd-toast--success .oxd-text--toast-message');
    await expect(toastMessage).toBeVisible({ timeout: 10000 });
    const messageToCheck = ADD_EMPLOYEE_MESSAGES.SUCCESS.UPDATE_EMPLOYEE;
    await expect(toastMessage).toHaveText(messageToCheck);
});

When('the user searches for {string} in employee list', async ({ page }, employeeName) => {
    const nameInput = page.locator('.oxd-table-filter form .oxd-autocomplete-text-input input').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });

    await nameInput.click();
    await nameInput.clear().catch(async () => {
        await nameInput.press('Control+a');
        await nameInput.press('Backspace');
    });

    await nameInput.pressSequentially(employeeName, { delay: 100 });

    const searchButton = page.locator('form button[type="submit"]').filter({ hasText: 'Search' });
    await searchButton.waitFor({ state: 'visible', timeout: 5000 });
    await searchButton.click({ force: true });

    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user clicks the edit button for employee {string}', async ({ page }, employeeName: string) => {
    await page.evaluate(() => {
        document.body.style.zoom = '60%';
    });

    const employeeRow = page.locator('.oxd-table-body .oxd-table-card').filter({
        hasText: employeeName,
    });

    await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });

    const editButton = employeeRow.first().locator('.bi-pencil-fill');
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click({ force: true });

    await page.evaluate(() => {
        document.body.style.zoom = '100%';
    });

    await page.waitForURL(/\/pim\/(viewPersonalDetails|viewContactDetails|empNumber)/, { timeout: 15000 });
});

When('the user fills Contact Details with:', async ({ page }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    const getFieldByLabel = (labelText: string) =>
        page
            .locator('.oxd-input-group')
            .filter({
                has: page.locator('label', { hasText: new RegExp(`^${labelText}$`, 'i') }),
            })
            .locator('input');

    const fillField = async (labelText: string, value?: string, delayMs = 300) => {
        if (!value) return;
        const el = getFieldByLabel(labelText);
        await el.waitFor({ state: 'visible', timeout: 5000 });

        await el.click();
        await el.press('Control+A');
        await el.press('Backspace');

        await el.fill(value);
        await el.blur();
        await page.waitForTimeout(delayMs);
    };

    await fillField('Street 1', data.street1);
    await fillField('Street 2', data.street2);
    await fillField('City', data.city);
    await fillField('State/Province', data.state);
    await fillField('Zip/Postal Code', data.zipCode);
    await fillField('Home', data.homeTelephone);
    await fillField('Mobile', data.mobile);
    await fillField('Work', data.workTelephone);
    await fillField('Work Email', data.workEmail);
    await fillField('Other Email', data.otherEmail);

    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user clicks the Save button for Contact Details', async ({ page }) => {
    const saveButton = page.locator('form button[type="submit"]').first();
    await saveButton.click();
});

When('the user navigates to "Personal Details" page', async ({ page }) => {
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
    const isAlreadyOnPersonalDetails = page.url().includes('viewPersonalDetails');

    if (!isAlreadyOnPersonalDetails) {
        const personalDetailsTab = page.locator('.orangehrm-edit-employee-navigation a', {
            hasText: 'Personal Details',
        });
        await personalDetailsTab.waitFor({ state: 'visible', timeout: 5000 });
        await personalDetailsTab.click();
    }
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user navigates to "Contact Details" page', async ({ page }) => {
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });

    const isAlreadyOnContactDetails = page.url().includes('viewContactDetails');

    if (!isAlreadyOnContactDetails) {
        const contactDetailsTab = page.locator('.orangehrm-edit-employee-navigation a', {
            hasText: 'Contact Details',
        });
        await contactDetailsTab.waitFor({ state: 'visible', timeout: 5000 });
        await contactDetailsTab.click();
    }
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user navigates to "Emergency Contacts" page', async ({ page }) => {
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });

    const isAlreadyOnEmergencyContacts = page.url().includes('viewEmergencyContacts');

    if (!isAlreadyOnEmergencyContacts) {
        const emergencyContactsTab = page.locator('.orangehrm-edit-employee-navigation a', {
            hasText: 'Emergency Contacts',
        });
        await emergencyContactsTab.waitFor({ state: 'visible', timeout: 5000 });
        await emergencyContactsTab.click();
    }
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user adds a new emergency contact with details:', async ({ page }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    const addButton = page.locator('.orangehrm-action-header button', { hasText: 'Add' }).first();
    await addButton.waitFor({ state: 'visible', timeout: 5000 });
    await addButton.click();
    await page.waitForTimeout(500);

    const getFieldByLabel = (labelText: string) =>
        page
            .locator('.oxd-input-group')
            .filter({
                has: page.locator('label', { hasText: new RegExp(`^${labelText}$`, 'i') }),
            })
            .locator('input');

    const fillField = async (labelText: string, value?: string, delayMs = 300) => {
        if (!value) return;
        const el = getFieldByLabel(labelText);
        await el.waitFor({ state: 'visible', timeout: 5000 });
        await el.clear();
        await el.fill(value);
        await el.blur();
        await page.waitForTimeout(delayMs);
    };

    await fillField('Name', data.name);
    await fillField('Relationship', data.relationship);
    await fillField('Home Telephone', data.homeTelephone);
    await fillField('Mobile', data.mobile);
    await fillField('Work Telephone', data.workTelephone);
});

When('the user clicks the Save button for Emergency Contacts', async ({ page }) => {
    const saveButton = page.locator('form button[type="submit"]').first();
    await saveButton.click();
});

const getFieldErrorByLabel = (page: Page, labelName: string) => {
    return page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('.oxd-label', { hasText: new RegExp(`^${labelName}$`, 'i') }),
        })
        .locator('.oxd-input-field-error-message');
};

Then('a restricted characters error message should be displayed under home telephone', async ({ page }) => {
    const homeErrorMessage = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('.oxd-label', { hasText: /^Home$/i }),
        })
        .locator('.oxd-input-field-error-message');

    await expect(homeErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(homeErrorMessage).toHaveText(
        ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_TELEPHONE_RESTRICTED_CHARACTERS
    );
});

Then('a restricted characters error message should be displayed under mobile telephone', async ({ page }) => {
    const mobileErrorMessage = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('.oxd-label', { hasText: /^Mobile$/i }),
        })
        .locator('.oxd-input-field-error-message');

    await expect(mobileErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(mobileErrorMessage).toHaveText(
        ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_TELEPHONE_RESTRICTED_CHARACTERS
    );
});

Then('a restricted characters error message should be displayed under work telephone', async ({ page }) => {
    const workErrorMessage = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('.oxd-label', { hasText: /^Work$/i }),
        })
        .locator('.oxd-input-field-error-message');

    await expect(workErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(workErrorMessage).toHaveText(
        ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_TELEPHONE_RESTRICTED_CHARACTERS
    );
});

Then('an invalid email format error message should be displayed under work email', async ({ page }) => {
    const errorMessage = getFieldErrorByLabel(page, 'Work Email');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_INVALID_EMAIL_FORMAT);
});

Then('an invalid email format error message should be displayed under other email', async ({ page }) => {
    const errorMessage = getFieldErrorByLabel(page, 'Other Email');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_INVALID_EMAIL_FORMAT);
});

When('the user enters a random email on {string}', async ({ page }, fieldLabel: string) => {
    const prefix = fieldLabel.toLowerCase().replace(/\s+/g, '_');
    const randomEmail = `${prefix}_${Math.floor(Math.random() * 10000)}@example.com`;

    const emailInput = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('.oxd-label', { hasText: new RegExp(`^${fieldLabel}$`, 'i') }),
        })
        .locator('input');

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.clear();
    await emailInput.fill(randomEmail);
    await emailInput.blur();
});

Then('a same email error message should be displayed under other email', async ({ page }) => {
    const otherEmailGroup = page.locator('.oxd-input-group').filter({
        has: page.locator('.oxd-label', { hasText: /^Other Email$/i }),
    });

    const errorMessageLocator = otherEmailGroup.locator('.oxd-input-group__message');

    await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
    await expect(errorMessageLocator).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_SAME_EMAIL);
});

Then('an already existing error message should be displayed under work email', async ({ page }) => {
    const workEmailGroup = page.locator('.oxd-input-group').filter({
        has: page.locator('label', { hasText: /^Work Email$/i }),
    });
    const workEmailInput = workEmailGroup.locator('input');
    await workEmailInput.focus();
    await workEmailInput.blur();
    const errorMessageLocator = workEmailGroup.locator('.oxd-input-group__message');

    await expect(errorMessageLocator).toBeVisible({ timeout: 10000 });
    await expect(errorMessageLocator).toHaveText(
        ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_EMPLOYEE_ALREADY_EXISTS_EMAIL
    );
});

When('the user clicks the attachment button', async ({ page }) => {
    const attachmentsSection = page.locator('.orangehrm-horizontal-padding').filter({
        has: page.locator('h6', { hasText: 'Attachments' }),
    }).or(
        page.locator('.orangehrm-card-container').filter({
            has: page.locator('h6, p', { hasText: 'Attachments' })
        })
    );

    const addAttachmentBtn = attachmentsSection.locator('button', { hasText: 'Add' }).first();

    await addAttachmentBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addAttachmentBtn.click();
    await page.waitForTimeout(500);
});

When('the user uploads a file with name {string} on Personal Details', async ({ page }, fileName: string) => {
    const filePath = path.join(__dirname, `../../fixtures/${fileName}`);

    const attachmentForm = page.locator('form').filter({
        has: page.locator('input[type="file"]'),
    });

    const fileInput = attachmentForm.locator('input[type="file"]');
    await fileInput.waitFor({ state: 'attached', timeout: 5000 });

    await fileInput.setInputFiles(filePath);

    const fileCustomInput = attachmentForm.locator('.oxd-file-input-div');
    await expect(fileCustomInput).not.toHaveText(/No file selected/i, { timeout: 5000 }).catch(() => { });

    const saveBtn = attachmentForm.locator('button[type="submit"]', { hasText: 'Save' });

    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    await saveBtn.click();

    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

Then('a file type not supported message should be displayed', async ({ page }) => {
    const fileInputGroup = page.locator('.oxd-input-group').filter({
        has: page.locator('.oxd-label', { hasText: /^Select File$/i }),
    });

    const errorMessageLocator = fileInputGroup.locator('.oxd-input-group__message');

    await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
    await expect(errorMessageLocator).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_ATTACHMENT_ALLOWED_FILE_TYPES);
});

Then('a file too large message should be displayed', async ({ page }) => {
    const fileInputGroup = page.locator('.oxd-input-group').filter({
        has: page.locator('.oxd-label', { hasText: /^Select File$/i }),
    });

    const errorMessageLocator = fileInputGroup.locator('.oxd-input-group__message');

    await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
    await expect(errorMessageLocator).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_ATTACHMENT_TOO_LARGE);
});

Then('a required error message should be displayed under attachment section', async ({ page }) => {
    const fileInputGroup = page.locator('.oxd-input-group').filter({
        has: page.locator('.oxd-label', { hasText: /^Select File$/i }),
    });

    const errorMessageLocator = fileInputGroup.locator('.oxd-input-group__message');

    await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
    await expect(errorMessageLocator).toHaveText(ADD_EMPLOYEE_MESSAGES.ERROR.UPDATE_ATTACHMENT_REQUIRED);
});

Then('the user clicks the Save button for attachment', async ({ page }) => {
    const attachmentForm = page.locator('form').filter({
        has: page.locator('label', { hasText: /^Select File$/i }),
    });

    const saveBtn = attachmentForm.locator('button[type="submit"]', { hasText: 'Save' });
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

Then('verify the uploaded file {string} should be displayed in the attachment table', async ({ page }, fileName: string) => {
    const attachmentContainer = page.locator('.orangehrm-paper-container').filter({
        has: page.locator('.orangehrm-main-title, h6, p', { hasText: /Attachments/i })
    });
    await attachmentContainer.waitFor({ state: 'visible', timeout: 10000 });

    const fileRow = attachmentContainer.locator('.oxd-table-card').filter({
        has: page.locator('.oxd-table-cell', { hasText: fileName })
    });

    await expect(fileRow.first()).toBeVisible({ timeout: 10000 });
});

const getAttachmentRow = (page: any, fileName: string) => {
    return page.locator('.oxd-table-card').filter({
        has: page.locator('.oxd-table-cell', { hasText: fileName }),
    });
};

When('user downloads the file with name {string} on Personal Details', async ({ page }, fileName: string) => {
    const row = getAttachmentRow(page, fileName);

    const downloadBtn = row.locator('button .bi-download, button .bi-file-earmark-arrow-down').locator('xpath=..')
        .or(row.locator('button').nth(2));

    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;

    (page as any).lastDownload = download;
});

Then('the file should be downloaded successfully', async ({ page }) => {
    const download = (page as any).lastDownload;
    expect(download).toBeTruthy();

    const suggestedFileName = download.suggestedFilename();
    expect(suggestedFileName).not.toBe('');
});

When('user edits the file with name {string} on Personal Details', async ({ page }, fileName: string) => {
    const fileRow = page.locator('.oxd-table-card').filter({
        has: page.locator('.oxd-table-cell', { hasText: fileName }),
    });
    await expect(fileRow).toBeVisible({ timeout: 10000 });
    const editBtn = fileRow.locator('.bi-pencil-fill').locator('xpath=..')
        .or(fileRow.locator('.oxd-table-cell-actions button').first());

    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();
});

When('the user deletes the attachment {string}', async ({ page }, fileName: string) => {
    const row = getAttachmentRow(page, fileName);

    const deleteBtn = row.locator('button .bi-trash').locator('xpath=..')
        .or(row.locator('button').nth(1));

    await deleteBtn.click();

    await page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});

When('the user confirms deleting the attachment', async ({ page }) => {
    const modal = page.getByRole('dialog').or(
        page.locator('.oxd-dialog-container').filter({
            has: page.locator('p, h6', { hasText: 'Are you Sure?' })
        })
    );

    const confirmBtn = modal.locator('button', { hasText: 'Yes, Delete' });
    await confirmBtn.click();

    await page.waitForTimeout(300);
});

When('the user cancels deleting the attachment', async ({ page }) => {
    const modal = page.locator('.oxd-dialog-container-default');

    await modal.waitFor({ state: 'visible', timeout: 5000 });

    const cancelBtn = modal.locator('button', { hasText: 'No, Cancel' });
    await cancelBtn.click();

    await modal.waitFor({ state: 'detached', timeout: 5000 });
});

Then('a successfully deleted message should be displayed', async ({ page }) => {
    const toast = page.locator('.oxd-toast, .oxd-toast-content--success, .oxd-text--toast-message');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(ADD_EMPLOYEE_MESSAGES.SUCCESS.UPDATE_ATTACHMENT_DELETION);
});

Then('verify {string} should still be displayed in the attachment table', async ({ page }, fileName: string) => {
    await page.locator('.oxd-loading-spinner, .oxd-form-loader').waitFor({ state: 'detached', timeout: 15000 }).catch(() => { });

    const fileRow = page.locator('.oxd-table-card').filter({
        has: page.locator('.oxd-table-cell', { hasText: fileName }),
    });

    await expect(fileRow.first()).toBeVisible({ timeout: 10000 });
});

When('the user uploads a new file with name {string}', async ({ page }, newFileName: string) => {
    const filePath = path.join(__dirname, `../../fixtures/${newFileName}`);

    const attachmentForm = page.locator('form').filter({
        has: page.locator('input[type="file"]'),
    });

    const fileInput = attachmentForm.locator('input[type="file"]');
    await fileInput.waitFor({ state: 'attached', timeout: 5000 });

    await fileInput.setInputFiles(filePath);

    const fileCustomInput = attachmentForm.locator('.oxd-file-input-div');
    await expect(fileCustomInput).toHaveText(new RegExp(newFileName, 'i'), { timeout: 5000 }).catch(() => { });

    const saveBtn = attachmentForm.locator('button[type="submit"]', { hasText: 'Save' });
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();

    await page.locator('.oxd-loading-spinner, .oxd-form-loader').waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
});
