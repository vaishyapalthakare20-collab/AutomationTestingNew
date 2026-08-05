SauceDemo — Data-Driven Playwright Framework (JavaScript + POM)

An industry-level test automation framework built with JavaScript + Playwright + Page Object Model (POM) + Data-Driven design. It automates the [SauceDemo](https://www.saucedemo.com) application and is designed as a real-world, teachable reference for QA/SDET engineers (1–5 years experience).

---

🚀 Tech Stack

| Layer            | Tool / Library                         |
| ---------------- | -------------------------------------- |
| Language         | JavaScript (Node.js)                   |
| Test Runner      | Playwright Test (`@playwright/test`)   |
| Design Pattern   | Page Object Model + BasePage           |
| Data-Driven      | External JSON / CSV test data          |
| Reporting        | Playwright HTML + Allure (+ env info) |
| Logging          | Winston                                |
| Config           | dotenv + multi-environment JSON (dev/qa/staging) |
| CI/CD            | Jenkins (`Jenkinsfile`) + GitHub Actions |

---

� Dependencies

All packages are installed as `devDependencies` (a test framework has no runtime production deps). Run `npm install` to get them all.

Core / Testing

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `@playwright/test` | ^1.48.0 | Playwright test runner — browsers, fixtures, assertions, HTML report, trace viewer |

Reporting

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `allure-playwright` | ^3.0.0 | Allure reporter that generates rich results during the test run |
| `allure-commandline` | ^2.30.0 | Bundles the Allure CLI to generate/open/serve the HTML report |

Logging & Configuration

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `winston` | ^3.14.2 | Structured logging to console + `logs/*.log` files |
| `dotenv` | ^16.4.5 | Loads environment variables from a `.env` file |
| `cross-env` | ^7.0.3 | Sets env vars (e.g. `ENV=staging`) cross-platform in npm scripts |

Utilities

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `rimraf` | ^6.0.1 | Cross-platform `rm -rf` used by the `clean` script to wipe reports |

> Note: Random test data (`dataGenerator.js`) and waits (`waitUtils.js`) are dependency-free — implemented with built-in Node/Playwright APIs, so there is no Faker dependency to install.

---

�📁 Project Structure

```
saucedemo-framework/
├── pages/                      # Page Object classes
│   ├── BasePage.js             # Reusable wrappers (click, fill, getText...)
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── CheckoutCompletePage.js
├── tests/                      # Spec files, grouped by module
│   ├── login/login.spec.js
│   ├── inventory/inventory.spec.js
│   ├── cart/cart.spec.js
│   ├── checkout/checkout.spec.js
│   └── unit/                   # Pure unit tests for utilities
├── test-data/                  # Data-Driven inputs
│   ├── loginData.json
│   ├── users.json
│   ├── checkoutData.json
│   └── products.json
├── utils/                      # Reusable utility layer
│   ├── logger.js               # Winston logger
│   ├── dataReader.js           # JSON/CSV readers
│   ├── constants.js            # Routes, messages, titles
│   ├── waitUtils.js            # retry / waitUntil / sleep
│   ├── dataGenerator.js        # Random test data (Faker-style)
│   ├── dateUtils.js            # Timestamps & date formatting
│   ├── stringUtils.js          # parsePrice, slugify, capitalize...
│   ├── fileUtils.js            # File read/write/download helpers
│   ├── assertionUtils.js       # Readable assertion wrappers
├── config/
│   ├── env.config.js           # Centralized multi-env access
│   └── environments/           # Per-environment settings
│       ├── dev.json
│       ├── qa.json
│       └── staging.json
├── fixtures/
│   └── baseFixture.js          # Fixtures: page objects, auto-login, data, failure screenshots
├── reports/                    # Generated reports (gitignored)
├── .github/workflows/playwright.yml
├── Jenkinsfile
├── global-setup.js             # Writes Allure environment info
├── playwright.config.js
├── package.json
├── .env / .env.example
└── README.md
```

---

🏗️ Framework Architecture

```
Test Spec  ──uses──►  Fixtures (DI)  ──inject──►  Page Objects  ──extend──►  BasePage  ──►  Playwright
     │                                                  │
     └──reads──►  test-data (JSON)              locators + actions
                        │
                  dataReader / constants / logger / env.config
```

- BasePage holds all generic Playwright interactions → child pages stay clean (DRY).
- Page Objects expose business actions (`login()`, `addProductToCart()`) — no locators in tests.
- Fixtures inject page objects and provide an auto-login (`loggedInPage`) session.
- Data-Driven: tests loop over external JSON to run the same flow with many datasets.

---

✅ Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+
- (Optional) Allure CLI — bundled via `allure-commandline` dev dependency
- (Optional) Java 8+ — required by Allure to generate reports

---

⚙️ Setup

```bash
# 1. Go to the framework folder
cd saucedemo-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Create your .env (copy the example)
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux
```

---

▶️ Running Tests

```bash
npm test                    # Run all tests (all browsers)
npm run test:headed         # Run in headed mode
npm run test:chromium       # Chromium only
npm run test:smoke          # Only @smoke tagged tests
npm run test:regression     # Only @regression tagged tests

# Module-wise
npm run test:login
npm run test:inventory
npm run test:cart
npm run test:checkout

# Specialized suites
npm run test:unit           # Utility unit tests (no browser)
```

Multi-Environment

The framework loads `config/environments/<ENV>.json` based on the `ENV` variable
(defaults to `qa`). Values can be overridden by individual `.env` variables.

```bash
npm run test:dev            # ENV=dev
npm run test:qa             # ENV=qa
npm run test:staging        # ENV=staging

# Or set ENV directly (PowerShell)
$env:ENV="staging"; npx playwright test
```

---

📊 Reports

Playwright HTML Report
```bash
npm run report
```

Allure Report
```bash
npm run allure:generate     # Generate from results
npm run allure:open         # Open generated report
# or one-shot:
npm run allure:serve
```

---

🧪 Test Coverage (~40 test cases)

| Module      | Cases | Highlights                                                     |
| ----------- | :---: | -------------------------------------------------------------- |
| Login       |  11   | Valid/locked/problem/perf users, invalid & empty (data-driven), logout |
| Inventory   |  11   | Product count, sorting (4 ways), add/remove, PDP navigation    |
| Cart        |   8   | Badge accuracy, persistence, remove, continue shopping, checkout nav |
| Checkout    |  10   | Valid checkout (data-driven + random data), field validations, totals, cancel, confirmation |
| Unit        |   4+  | Pure tests for stringUtils, dataGenerator, dateUtils, waitUtils |

Tests are tagged with `@smoke`, `@regression` and `@unit` for selective execution. Long checkout flows use `test.step()` grouping and `expect.soft()` soft assertions so a single run reports all failures.

---

🧰 Reusable Utility Layer

This is what makes it a real-time framework — a rich, shared utility layer used across all Page Objects and tests:

| File | Purpose | Example methods |
| ---- | ------- | --------------- |
| `pages/BasePage.js` | Wraps every Playwright interaction | `click`, `doubleClick`, `hover`, `type`, `dragAndDrop`, `check`, `selectByValue/Label/Index`, `uploadFile`, `acceptDialog`, `frame`, `openNewTab`, `scrollIntoView`, `executeScript`, `jsClick`, `waitForUrl`, `takeScreenshot` |
| `utils/waitUtils.js` | Smart waits & retry (no hard sleeps) | `retry`, `waitUntil`, `sleep` |
| `utils/dataGenerator.js` | Unique random test data | `customer`, `email`, `firstName`, `postalCode`, `randomString` |
| `utils/dateUtils.js` | Dates & timestamps | `today`, `addDays`, `fileTimestamp` |
| `utils/stringUtils.js` | String/number helpers | `parsePrice`, `toCurrency`, `slugify`, `capitalize` |
| `utils/fileUtils.js` | Filesystem & downloads | `writeText`, `readText`, `saveDownload`, `ensureDir` |
| `utils/assertionUtils.js` | Readable assertion wrappers | `assertEquals`, `assertVisible`, `assertHasText` |

Example — using utilities in a test:
```js
import dataGenerator from '../../utils/dataGenerator.js';
import { parsePrice } from '../../utils/stringUtils.js';
import { retry } from '../../utils/waitUtils.js';

const cust = dataGenerator.customer();            // unique data every run
await checkoutPage.fillCustomerInfo(cust.firstName, cust.lastName, cust.postalCode);

const price = parsePrice('$29.99');               // -> 29.99

await retry(() => inventoryPage.addProductToCart('Sauce Labs Backpack'), { retries: 3 });
```

---


🔁 CI/CD

GitHub Actions
`.github/workflows/playwright.yml` runs tests on push/PR across Chromium, Firefox, WebKit (matrix), uploads HTML + Allure artifacts, and publishes a merged Allure report.

Jenkins
`Jenkinsfile` (declarative pipeline) with parameters (`BROWSER`, `SUITE`), stages for install → browsers → test → Allure, and post steps for JUnit/Allure/HTML publishing.

> Jenkins plugins needed: NodeJS, Allure, HTML Publisher, AnsiColor, Timestamper.

---

🔬 Locator Strategy (Teaching)

Page Objects intentionally use a mix of locator strategies, as seen in real projects:

- Built-in locators (preferred): `getByRole`, `getByPlaceholder`, `getByText`, `getByTestId`
- CSS locators: `#id`, `.class`, `[data-test=...]`
- XPath locators: e.g. `//button[@data-test='cancel']`

This teaches students when each approach is appropriate.

---

📚 Teaching Notes

- Start with `BasePage.js` → explain reusable wrappers.
- Move to a Page Object (`LoginPage.js`) → locators + actions.
- Show a spec (`login.spec.js`) → how tests consume page objects via fixtures.
- Explain Data-Driven using `loginData.json` + the `for...of` loop pattern.
- Finish with reporting (Allure) and CI/CD (Jenkins + GitHub Actions).

---

📝 Notes

- SauceDemo uses the same password (`secret_sauce`) for all users.
- Traces, videos and screenshots are captured only on failure to keep runs fast.
- Never commit the real `.env`; commit only `.env.example`.
