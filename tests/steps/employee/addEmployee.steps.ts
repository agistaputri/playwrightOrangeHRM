import { createBdd } from 'playwright-bdd';
import { expect, Page } from '@playwright/test';
import { ADD_EMPLOYEE_MESSAGES, CREDENTIALS } from '../../constants';


const { Given, When, Then } = createBdd();

Given('the user is logged in as Admin', async ({ page }) => {
  await page.goto(process.env.BASE_URL || '/', {
    waitUntil: 'networkidle',
  });

  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  await usernameInput.fill(CREDENTIALS.VALID_USER.username);
  await page.locator('input[name="password"]').fill(CREDENTIALS.VALID_USER.password);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*dashboard/);
});

Given('the user navigates to the {string} page', async ({ page }, pageName: string) => {

  if (pageName === 'Add Employee') {
    const pimMenu = page.locator('a:has-text("PIM"), span:has-text("PIM")').first();
    if (await pimMenu.isVisible()) {
      await pimMenu.click();
      await page.locator('a:has-text("Add Employee"), button:has-text("Add")').first().click();
    } else {
      await page.goto(`${process.env.BASE_URL || ''}/web/index.php/pim/addEmployee`, {
        waitUntil: 'networkidle',
      });
    }
  } else if (pageName === 'Employee List') {
    await page.goto(`${process.env.BASE_URL || ''}/web/index.php/pim/viewEmployeeList`, {
      waitUntil: 'networkidle',
    });
  } else if (pageName === 'Admin') {
    await page.goto(`${process.env.BASE_URL || ''}/web/index.php/admin/viewSystemUsers`, {
      waitUntil: 'networkidle',
    });
  } else {
    await page.locator(`a:has-text("${pageName}"), button:has-text("${pageName}")`).click();
  }
  await page.waitForLoadState('networkidle');
});


When('the user enters First Name {string} and Last Name {string}', async ({ page }, firstName: string, lastName: string) => {
  await page.locator('input[name="firstName"]').fill(firstName);
  await page.locator('input[name="lastName"]').fill(lastName);
});

When(
  'the user enters First Name {string}, Middle Name {string}, and Last Name {string}',
  async ({ page }, firstName: string, middleName: string, lastName: string) => {
    await page.locator('input[name="firstName"]').fill(firstName);
    await page.locator('input[name="middleName"]').fill(middleName);
    await page.locator('input[name="lastName"]').fill(lastName);
  }
);

let lastCustomEmployeeId = '';
const generateRandomEmployeeId = (): string => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `EMP${randomSuffix}`;
};



const fillEmployeeId = async (page: any, employeeId: string) => {
  const empIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input, label:has-text("Employee Id") ~ div input').first();
  await empIdInput.click();
  await empIdInput.press('ControlOrMeta+a');
  await empIdInput.press('Backspace');
  await empIdInput.fill(employeeId);
};

When('the user enters Employee ID {string}', async ({ page }, employeeId: string) => {

  await fillEmployeeId(page, employeeId);

});



When('the user enters a random custom Employee ID', async ({ page }) => {

  lastCustomEmployeeId = generateRandomEmployeeId();

  await fillEmployeeId(page, lastCustomEmployeeId);

});



When('the user enters a random custom ID', async ({ page }) => {

  lastCustomEmployeeId = generateRandomEmployeeId();

  await fillEmployeeId(page, lastCustomEmployeeId);

});

When('the user enters an already existing Employee ID {string}', async ({ page }, employeeId: string) => {
  await fillEmployeeId(page, employeeId);
});

When('the user leaves First Name and Last Name empty', async ({ page }) => {
  await page.locator('input[name="firstName"]').clear();
  await page.locator('input[name="lastName"]').clear();
});

When('the user toggles on {string}', async ({ page }, _toggleName: string) => {
  const switchToggle = page.locator('.oxd-switch-input, input[type="checkbox"]').first();
  await switchToggle.click({ force: true });
});

When(
  'the user sets Username {string}, Password {string}, and Confirm Password {string}',
  async ({ page }, username: string, password: string, confirmPassword: string) => {
    const uniqueUsername = `${username}_${Date.now()}`;
    const usernameInput = page.locator('.oxd-input-group:has-text("Username") input');
    await usernameInput.click();
    await usernameInput.press('Control+A');
    await usernameInput.press('Backspace');
    await usernameInput.fill(uniqueUsername);
    await usernameInput.blur();

    const passwordInput = page
      .locator('.oxd-input-group:has(label:text-is("Password")) input, .oxd-input-group:has-text("Password"):not(:has-text("Confirm")) input')
      .first();
    await passwordInput.click();
    await passwordInput.fill(password);

    const confirmPasswordInput = page.locator('.oxd-input-group:has-text("Confirm Password") input');
    await confirmPasswordInput.click();
    await confirmPasswordInput.fill(confirmPassword);
    await confirmPasswordInput.blur();
  }
);



When('the user sets Username {string}', async ({ page }, username: string) => {
  await page.locator('.oxd-input-group:has-text("Username") input').fill(username);
});



When(
  'the user sets Password {string} and Confirm Password {string}',
  async ({ page }, password: string, confirmPassword: string) => {
    await page
      .locator('.oxd-input-group:has(label:text-is("Password")) input, .oxd-input-group:has-text("Password"):not(:has-text("Confirm")) input')
      .first()
      .fill(password);
    await page.locator('.oxd-input-group:has-text("Confirm Password") input').fill(confirmPassword);
  }
);

When('the user sets Status to {string}', async ({ page }, status: string) => {
  const statusRadio = page.locator(`.oxd-radio-wrapper:has-text("${status}") label, label:has-text("${status}")`).first();
  await statusRadio.click();
});

When('the user clicks the {string} button', async ({ page }, buttonName: string) => {
  if (buttonName.toLowerCase() === 'save') {
    await page.locator('button[type="submit"]:has-text("Save")').first().click();
  } else if (buttonName.toLowerCase() === 'cancel') {
    await page.locator('button:has-text("Cancel")').first().click();
  } else {
    await page.locator(`button:has-text("${buttonName}")`).first().click();
  }
});

Then('a successfully saved message should be displayed', async ({ page }) => {
  const toastMessage = page.locator('.oxd-text--toast-message').first();

  await expect(toastMessage).toBeVisible({ timeout: 10000 });
  await expect(toastMessage).toContainText(ADD_EMPLOYEE_MESSAGES.SUCCESS.ADD_EMPLOYEE);
});

Then(
  'the user should be redirected to the {string} page for the new employee',
  async ({ page }, _pageName: string) => {
    await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*|.*pim\/addEmployee.*/, { timeout: 15000 });
    const heading = page.locator('h6:has-text("Personal Details"), a:has-text("Personal Details"), h6:has-text("PIM")');
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  }
);



Then(
  'the employee {string} with ID {string} should be saved in the system',
  async ({ page }, _fullName: string, _employeeId: string) => {
    await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/, { timeout: 15000 });
    const employeeHeader = page.locator('.orangehrm-edit-employee-name, h6:has-text("Personal Details")');
    await expect(employeeHeader.first()).toBeVisible();
  }
);

Then(
  'the employee {string} with custom ID should be saved in the system',
  async ({ page }, _fullName: string) => {
    await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/, { timeout: 15000 });
    const employeeHeader = page.locator('.orangehrm-edit-employee-name, h6:has-text("Personal Details")');
    await expect(employeeHeader.first()).toBeVisible();
  }
);



Then(
  'the employee {string} with the custom ID should be saved in the system',
  async ({ page }, _fullName: string) => {
    await expect(page).toHaveURL(/.*pim\/viewPersonalDetails.*/, { timeout: 15000 });
    const employeeHeader = page.locator('.orangehrm-edit-employee-name, h6:has-text("Personal Details")');
    await expect(employeeHeader.first()).toBeVisible();
  }
);



Then(
  'the new employee should be able to log in with username {string} and password {string}',
  async ({ page }, username: string, password: string) => {
    await page.locator('.oxd-userdropdown-tab').click();
    await page.locator('a:has-text("Logout")').click();
    await expect(page).toHaveURL(/.*login/);
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  }
);



Then('a required error message should be displayed under First Name', async ({ page }) => {
  const errorMsg = page.locator('.oxd-input-group:has(input[name="firstName"]) .oxd-input-field-error-message').first();
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText(ADD_EMPLOYEE_MESSAGES.ERROR.ADD_EMPLOYEE_REQUIRED);
});



Then('a required error message should be displayed under Last Name', async ({ page }) => {
  const errorMsg = page.locator('.oxd-input-group:has(input[name="lastName"]) .oxd-input-field-error-message').last();
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText(ADD_EMPLOYEE_MESSAGES.ERROR.ADD_EMPLOYEE_REQUIRED);
});



Then('the employee record should not be created', async ({ page }) => {
  await expect(page).toHaveURL(/.*pim\/addEmployee/);
});

Then(
  'an already exist employee ID error message should be displayed under the Employee ID field',
  async ({ page }) => {
    const errorMsg = page.locator('.oxd-input-group:has-text("Employee Id") .oxd-input-field-error-message');
    await expect(errorMsg.first()).toBeVisible();
    await expect(errorMsg.first()).toContainText(ADD_EMPLOYEE_MESSAGES.ERROR.ADD_EMPLOYEE_ALREADY_EXISTS);
  }
);



Then('a pasword not match error message should be displayed under Confirm Password', async ({ page }) => {
  const errorMsg = page.locator('.oxd-input-group:has-text("Confirm Password") .oxd-input-field-error-message');
  await expect(errorMsg.first()).toBeVisible();
  await expect(errorMsg.first()).toContainText(ADD_EMPLOYEE_MESSAGES.ERROR.ADD_EMPLOYEE_PASSWORDS_DO_NOT_MATCH)
});



Then('a minimum character error message should be displayed under Username', async ({ page }) => {
  const errorMsg = page.locator('.oxd-input-group:has-text("Username") .oxd-input-field-error-message');
  await expect(errorMsg.first()).toBeVisible();
  await expect(errorMsg.first()).toContainText(ADD_EMPLOYEE_MESSAGES.ERROR.ADD_EMPLOYEE_SHOULD_BE_AT_LEAST_5_CHARACTERS);

});



Then('the user should be redirected to the {string} page', async ({ page }, pageName: string) => {
  if (pageName === 'Employee List') {
    await expect(page).toHaveURL(/.*pim\/viewEmployeeList.*/);
  } else {
    await expect(page.locator(`h6:has-text("${pageName}")`).first()).toBeVisible();
  }
});



Then('the employee {string} should not be created', async ({ page }, _employeeName: string) => {
  await expect(page).not.toHaveURL(/.*pim\/viewPersonalDetails.*/);
});


