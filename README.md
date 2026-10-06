# OrangeHRM Automation & Performance Test Suite

An end-to-end (E2E) automated testing framework and performance testing suite for the **OrangeHRM Web Application**. Built using **Playwright-BDD (Cucumber/Gherkin)** in **TypeScript** for functional UI testing, and **Grafana k6** for API load testing.

---

## 🚀 Key Features & Scope

### 🧪 Functional E2E Testing (Playwright-BDD)
- **Authentication**: Valid/invalid credentials handling, logout flow, and session persistence.
- **Role-Based Access Control (RBAC)**: Validating permission levels between `Admin` and `ESS` user profiles.
- **Employee Lifecycle (PIM Module)**:
  - **Add Employee**: Employee creation with dynamic timestamped data to avoid collisions.
  - **Update Employee**: Updating personal details, contact info, and managing file attachments (Add/Edit/Delete).
  - **Delete Employee**: Search and remove records from the employee list table.

### ⚡ Performance & Load Testing (k6)
- **Load Testing**: Simulating concurrent virtual user load on authentication endpoints and employee creation APIs (`/api/v2/pim/employees`).
- **Metrics Tracking**: Monitoring response times, error rates (`http_req_failed`), and system throughput under stress.

---

## 🛠️ Tech Stack & Tools

- **Language & Runtime**: TypeScript, Node.js (v18+ recommended)
- **UI Automation Framework**: `@playwright/test`, `playwright-bdd`
- **Behavior-Driven Development (BDD)**: Cucumber / Gherkin syntax
- **Load / Performance Testing**: Grafana k6
- **Target Platform**: OrangeHRM (Single Page Application / Vue.js)

---

## 📁 Project Structure

```text
├── .features-gen/               # Generated Playwright spec files from BDD scenarios
├── features/                    # Feature files written in Gherkin (.feature)
│   ├── auth/                    # Authentication feature files
│   └── employee/                # Employee management & RBAC feature files
├── tests/
│   ├── fixtures/                # Test assets & upload files (e.g., PDFs, images)
│   └── steps/                   # Step definition files (.ts)
│       ├── auth/
│       └── employee/
├── performance/                 # Performance testing scripts
│   └── performance-test.js      # k6 load testing scenarios
├── .env                         # Environment variables configuration
├── playwright.config.ts         # Playwright & BDD runner configuration
├── package.json                 # Project dependencies & scripts
└── README.md                    # Project documentation
```

---

## ⚙️ Prerequisites & Environment Setup

### 1. Prerequisites
- **Node.js**: `v18.x` or higher installed.
- **k6**: Installed globally on your operating system.
  - *Windows*: `winget install k6 --source winget` or download from [k6.io](https://k6.io).
  - *Mac*: `brew install k6`

### 2. Installation
Clone this repository and install dependencies:
```bash
git clone <repository-url>
cd compareClub-automation-project
npm install
```

### 3. Configure Environment Variables (`.env`)
Create a `.env` file in the root directory of the project and populate it with your environment credentials:

```ini
BASE_URL=https://opensource-demo.orangehrmlive.com
VALID_USERNAME=Admin
VALID_PASSWORD=admin123
INVALID_USERNAME=InvalidUser
INVALID_PASSWORD=InvalidPassword123
ESS_USERNAME=ess.user
ESS_PASSWORD=ess.password123
```

---

## 🏃 Execution Commands

### 1. Generate BDD Tests
Before executing Playwright-BDD tests, compile the `.feature` files into Playwright spec files:
```bash
npx bddgen
```

### 2. Run E2E UI Tests (Playwright)

Run all E2E tests in headless mode:
```bash
npx playwright test
```

Run tests with interactive UI / browser mode:
```bash
npx playwright test --headed
```

Run tests with Playwright Trace Viewer for debugging:
```bash
npx playwright test --debug
```

Run a specific feature or tagged scenario:
```bash
npx playwright test -g "@updateEmployee"
```

Show test execution report:
```bash
npx playwright show-report
```

---

### 3. Run Performance Tests (k6)

Run the k6 load test script:
```bash
k6 run performance/performance-test.js
```

Run k6 with a custom target URL via environment flags:
```bash
k6 run -e BASE_URL=https://opensource-demo.orangehrmlive.com performance/performance-test.js
```

---

## 🔍 Troubleshooting & Common Fixes

1. **`TimeoutError: locator.waitFor` on file attachments**:
   Ensure that the "Add" or "Edit (Pencil)" button in the Attachments table is clicked to render the hidden `<input type="file">` element before attempting `.setInputFiles()`.
2. **`k6 : The term 'k6' is not recognized`**:
   Restart VS Code or your terminal after installing k6 so that system `PATH` environment variables are reloaded.
3. **Outdated BDD Specs**:
   If step definitions do not match test runs, clear and regenerate spec files using `npx bddgen`.