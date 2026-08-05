🎓 Trainer's Guide — Building the Playwright Framework Step by Step (Live Coding)

> Purpose of this document: This is your complete teaching companion. It tells you where to start, what to build in every class, in what order, and why — so you can build this SauceDemo Data-Driven Playwright framework live, from an empty folder to a production-ready framework, while confidently explaining the purpose of every step.
>
> Golden rule for live teaching: _Never introduce a file before the pain it solves exists._ Let students feel the problem first, then introduce the solution. That is how the framework "earns" every folder and file.

---

📑 Table of Contents

1. [How to Use This Guide](#how-to-use-this-guide)
2. [The Teaching Philosophy — Build by Pain, Not by Folders](#the-teaching-philosophy)
3. [The Very First Step (and Why)](#session-0)
4. [The Full Roadmap at a Glance](#the-full-roadmap-at-a-glance)
5. [Session-by-Session Build Plan](#session-by-session-build-plan)
   - [Session 1 — Project Setup & First Test](#session-1)
   - [Session 2 — Page Object Model (POM)](#session-2)
   - [Session 3 — BasePage (Inheritance & DRY)](#session-3)
   - [Session 4 — Configuration & Environments](#session-4)
   - [Session 5 — Fixtures (Dependency Injection)](#session-5)
   - [Session 6 — Utilities Layer](#session-6)
   - [Session 7 — Data-Driven Testing](#session-7)
   - [Session 8 — Logging & Reporting](#session-8)
   - [Session 9 — Cross-Browser & Parallel Execution](#session-9)
   - [Session 10 — Unit Testing](#session-10)
   - [Session 11 — CI/CD](#session-11)
   - [Session 12 — Final Execution Flow & Wrap-Up](#session-12)
6. [Folder Structure — What & Why](#folder-structure-what--why)
7. [Common Mistakes Students Make](#common-mistakes-students-make)
8. [Final Execution Flow](#final-execution-flow)
9. [Trainer's Quick Checklist](#trainers-quick-checklist)

---

How to Use This Guide

Each session below follows the same repeatable teaching pattern so students learn a rhythm:

| Block | What you do |
| ----- | ----------- |
| 🎯 Goal | One sentence: what we build this session |
| 😖 The Pain | The problem that makes this step necessary (demo it live) |
| 🛠️ Build Live | Files to create, in order |
| 💡 Why It Matters | The concept/principle being taught |
| ✅ Best Practices | Rules to drill in |
| ⚠️ Common Mistakes | What students get wrong + the fix |
| 🧪 Run & Prove | The command to run so students *see* it work |

> Tip: Keep the finished framework open in a second window as your "answer key," but type everything fresh in class. Students learn from watching you build (and recover from small mistakes), not from copy-paste.

---

The Teaching Philosophy

Students remember why, not what. So we build the framework the way it actually evolved in real life:

```
Plain test  →  it works but is messy  →  introduce a pattern to clean it  →  repeat
```

Every layer we add solves a concrete pain from the previous layer:

| Stage | Pain from previous stage | Solution we introduce |
| ----- | ------------------------ | --------------------- |
| 1. Raw test | Nothing yet | A single working test |
| 2. POM | Selectors copy-pasted everywhere | Page Objects |
| 3. BasePage | Same `click/fill` code in every page | A shared parent class |
| 4. Config | Hard-coded URLs & users | Central config + environments |
| 5. Fixtures | `new LoginPage(page)` in every test | Fixtures inject objects |
| 6. Utils | Repeated waits, parsing, logging | Reusable helpers |
| 7. Data-driven | One test per data set | Loop over JSON data |
| 8. Reporting | "It failed" — but no evidence | Logs, screenshots, Allure |
| 9. Cross-browser | "Works on my Chrome" | Projects + parallel workers |
| 10. Advanced | Only functional coverage | Unit tests |
| 11. CI/CD | "Runs on my machine" | Jenkins, GitHub Actions |

Write this table on the board on Day 1. It is the map of the whole course.

---

Session 0

🟢 The Very First Step (and Why)

> The very first step is NOT writing a test. It is creating and initializing the project with `npm init` and installing Playwright.

Why this is first:

1. A framework needs a home — a folder with a `package.json` that records every dependency and script. Without it, nothing is reproducible.
2. Playwright needs to be installed before any test can run.
3. It sets the professional tone: _"We build on a managed, versioned project — not loose script files."_

Build live (in an empty folder):

```powershell
# 1. Create and enter the project folder
mkdir saucedemo-framework
cd saucedemo-framework

# 2. Initialize the project — creates package.json
npm init -y

# 3. Install Playwright test runner
npm install -D @playwright/test

# 4. Download the browsers Playwright drives
npx playwright install
```

Then explain `package.json`: it is the identity card of the project — name, scripts, and the exact versions of every dependency. Add `"type": "module"` so we can use modern `import/export` syntax.

⚠️ Common mistake: Students skip `npm init` and just start writing `.js` files. Then nothing is reproducible and `npm install` later fails. Always initialize first.

✅ Best practice: Commit `package.json` and `package-lock.json` to Git. Never commit `node_modules/`.

---

The Full Roadmap at a Glance

```
Session 1  ▸ Setup + first raw test               → tests/, playwright.config.js
Session 2  ▸ Page Object Model                     → pages/LoginPage.js, InventoryPage.js
Session 3  ▸ BasePage (inheritance)                → pages/BasePage.js
Session 4  ▸ Config & environments                 → config/, .env
Session 5  ▸ Fixtures (dependency injection)       → fixtures/baseFixture.js
Session 6  ▸ Utilities                             → utils/logger, waitUtils, etc.
Session 7  ▸ Data-driven testing                   → test-data/, dataReader.js
Session 8  ▸ Logging & reporting                   → reporters, Allure, screenshots
Session 9  ▸ Cross-browser + parallel              → projects[], workers, retries
Session 10 ▸ Unit tests                            → tests/unit
Session 11 ▸ CI/CD                                  → Jenkinsfile, GitHub Actions
Session 12 ▸ Full execution flow + reports         → run the whole suite end to end
```

Each session below expands one line of this roadmap.

---

Session-by-Session Build Plan

---

<a id="session-1"></a>
🧩 Session 1 — Project Setup & Your First Test

🎯 Goal: Get one real test running against SauceDemo, with a minimal config.

😖 The Pain: "We have Playwright installed — but how do we prove it works? And where do tests live?"

🛠️ Build Live (in order):

1. `playwright.config.js` — start minimal, grow it later:
   ```javascript
   import { defineConfig } from '@playwright/test';

   export default defineConfig({
     testDir: './tests',
     use: {
       baseURL: 'https://www.saucedemo.com',
       headless: true,
     },
   });
   ```
2. `tests/login/positiveLogin.spec.js` — a raw test with selectors inline (deliberately messy):
   ```javascript
   import { test, expect } from '@playwright/test';

   test('valid user can log in', async ({ page }) => {
     await page.goto('/');
     await page.fill('#user-name', 'standard_user');
     await page.fill('#password', 'secret_sauce');
     await page.click('#login-button');
     await expect(page.locator('.title')).toHaveText('Products');
   });
   ```

💡 Why It Matters:
- `defineConfig` gives type hints and one place for global settings.
- `baseURL` lets tests use `page.goto('/')` instead of full URLs.
- `testDir` tells Playwright where to discover specs.

✅ Best Practices:
- Organize tests by feature folder (`tests/login/`) from day one.
- Name specs `*.spec.js` so Playwright auto-discovers them.
- One assertion per behavior; use web-first assertions (`await expect(...)`).

⚠️ Common Mistakes:
- Using `page.waitForTimeout(5000)` "to be safe" — teach auto-waiting instead.
- Forgetting `await` before Playwright calls — everything is async.
- Hard-coding the full `https://...` URL instead of using `baseURL`.

🧪 Run & Prove:
```powershell
npx playwright test
npx playwright show-report
```

> Teaching beat: Now point at the inline selectors and ask: _"If SauceDemo changes the login button ID, and we have 50 tests — how many files do we edit?"_ That pain sets up Session 2.

---

<a id="session-2"></a>
🧩 Session 2 — Page Object Model (POM)

🎯 Goal: Move selectors and actions out of tests into Page Object classes.

😖 The Pain (from S1): Selectors are duplicated across tests; one UI change breaks everything; tests read like robot instructions, not business steps.

🛠️ Build Live (in order):

1. `pages/LoginPage.js`:
   ```javascript
   import { ROUTES } from '../utils/constants.js'; // add constants later; hardcode '/' for now

   export class LoginPage {
     constructor(page) {
       this.page = page;
       this.usernameInput = page.getByPlaceholder('Username');
       this.passwordInput = page.locator('#password');
       this.loginButton = page.getByRole('button', { name: 'Login' });
       this.errorMessage = page.locator('[data-test="error"]');
     }
     async open() { await this.page.goto('/'); }
     async login(username, password) {
       await this.usernameInput.fill(username);
       await this.passwordInput.fill(password);
       await this.loginButton.click();
     }
     async getErrorMessage() { return this.errorMessage.textContent(); }
   }
   ```
2. `pages/InventoryPage.js` — the products page (title, add-to-cart, sort dropdown, cart badge).
3. Refactor the S1 test to use the page object:
   ```javascript
   test('valid user can log in', async ({ page }) => {
     const loginPage = new LoginPage(page);
     await loginPage.open();
     await loginPage.login('standard_user', 'secret_sauce');
     await expect(page.locator('.title')).toHaveText('Products');
   });
   ```

💡 Why It Matters: POM separates "what the page can do" (page object) from "what we are testing" (spec). Selectors live in exactly one place.

✅ Best Practices:
- Locators are defined once in the constructor, never inline in tests.
- Methods return data or nothing — never assertions inside page objects (assertions belong in tests).
- Prefer role/label/placeholder locators (`getByRole`, `getByPlaceholder`) over brittle XPath. Show a mix so students know all strategies.

⚠️ Common Mistakes:
- Putting `expect()` assertions inside page objects (couples pages to test logic).
- Creating one giant `Pages.js` file instead of one class per page.
- Re-declaring locators inside methods instead of the constructor.

🧪 Run & Prove: Same test passes, but now change a selector in one place and show all tests still work.

> Teaching beat: Open `LoginPage` and `InventoryPage` side by side. Both have `click`, `fill`, `getText`... _"We're copying the same low-level code into every page. Can we share it?"_ → Session 3.

---

<a id="session-3"></a>
🧩 Session 3 — BasePage (Inheritance & DRY)

🎯 Goal: Create a `BasePage` parent that all page objects extend, holding shared, logged action wrappers.

😖 The Pain (from S2): Every page repeats the same `await locator.click()`, `await locator.fill()`, waits, and (soon) logging.

🛠️ Build Live (in order):

1. `pages/BasePage.js`:
   ```javascript
   export class BasePage {
     constructor(page) {
       this.page = page;
     }

     // Accepts a string selector OR a Locator — polymorphic helper
     _resolve(locator) {
       return typeof locator === 'string' ? this.page.locator(locator) : locator;
     }

     async goto(path) { await this.page.goto(path); }
     async click(locator) { await this._resolve(locator).click(); }
     async fill(locator, text) {
       const el = this._resolve(locator);
       await el.fill(text);
     }
     async getText(locator) { return this._resolve(locator).textContent(); }
     async isVisible(locator) { return this._resolve(locator).isVisible(); }
     async count(locator) { return this._resolve(locator).count(); }
     async selectByValue(locator, value) { await this._resolve(locator).selectOption(value); }
     // ...grow to ~30 wrappers as pain appears
   }
   ```
2. Update each page to extend it:
   ```javascript
   import { BasePage } from './BasePage.js';

   export class LoginPage extends BasePage {
     constructor(page) {
       super(page);
       this.usernameInput = page.getByPlaceholder('Username');
       // ...
     }
     async login(username, password) {
       await this.fill(this.usernameInput, username);
       await this.fill(this.passwordInput, password);
       await this.click(this.loginButton);
     }
   }
   ```

💡 Why It Matters: This is where you teach the four OOP pillars live:
- Inheritance — every page `extends BasePage`.
- Encapsulation — locators are private details of each page.
- Polymorphism — `_resolve()` accepts a string *or* a Locator; children can override methods.
- Abstraction — tests call `login()`, not raw Playwright.

✅ Best Practices:
- Put only generic, reusable actions in `BasePage`. Page-specific logic stays in child pages.
- One choke point (`_resolve`, later logging) means you can add cross-cutting behavior in one place.

⚠️ Common Mistakes:
- Forgetting `super(page)` in the child constructor → `this.page` is undefined.
- Putting page-specific locators/methods in `BasePage`.
- Over-engineering `BasePage` with 100 methods on day one — grow it as needed.

🧪 Run & Prove: All tests still pass, but now every page shares one implementation of `click/fill/getText`.

---

<a id="session-4"></a>
🧩 Session 4 — Configuration & Environments

🎯 Goal: Remove hard-coded URLs, users, and timeouts. Support `dev` / `qa` / `staging`.

😖 The Pain (from S3): `'standard_user'`, `'secret_sauce'`, and `'https://www.saucedemo.com'` are scattered in tests and pages. Switching environments means find-and-replace.

🛠️ Build Live (in order):

1. `config/environments/qa.json`, `dev.json`, `staging.json` — per-env base URLs, credentials.
2. `config/env.config.js` — reads `process.env.ENV` (default `qa`), loads the matching JSON, merges `.env` overrides, exports one typed `env` object (`baseURL`, `password`, `users`, `timeouts`, `headless`, `logLevel`).
3. `.env.example` (committed) + `.env` (local, git-ignored) via `dotenv`.
4. Wire config into `playwright.config.js`:
   ```javascript
   import { env } from './config/env.config.js';
   export default defineConfig({
     use: { baseURL: env.baseURL, headless: env.headless },
     timeout: env.timeouts.test,
     expect: { timeout: env.timeouts.expect },
   });
   ```
5. `utils/constants.js` — routes, messages, sort options, expected counts (no more magic strings).

💡 Why It Matters: Configuration is externalized. The same test code runs against any environment by changing one variable: `ENV=staging`.

✅ Best Practices:
- Never commit secrets — `.env` is git-ignored; `.env.example` documents the shape.
- Provide safe defaults so the framework runs even without a `.env`.
- Centralize every magic string in `constants.js`.

⚠️ Common Mistakes:
- Committing `.env` with real credentials.
- Reading `process.env` directly in tests instead of the central `env` object.
- Hard-coding timeouts in tests instead of `env.timeouts`.

🧪 Run & Prove:
```powershell
$env:ENV="staging"; npx playwright test
```

---

<a id="session-5"></a>
🧩 Session 5 — Fixtures (Dependency Injection)

🎯 Goal: Stop writing `new LoginPage(page)` in every test. Let Playwright inject ready-to-use page objects.

😖 The Pain (from S4): Every test begins with 4–5 lines of `const loginPage = new LoginPage(page); const inventoryPage = ...`. Repetitive and error-prone.

🛠️ Build Live (in order):

1. `fixtures/baseFixture.js` — extend Playwright's base test:
   ```javascript
   import { test as base, expect } from '@playwright/test';
   import { LoginPage } from '../pages/LoginPage.js';
   import { InventoryPage } from '../pages/InventoryPage.js';
   import { env } from '../config/env.config.js';

   const test = base.extend({
     loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
     inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },

     // Auto-login fixture for tests that need an authenticated session
     loggedInPage: async ({ page }, use) => {
       const loginPage = new LoginPage(page);
       await loginPage.open();
       await loginPage.login(env.users.standard, env.password);
       await page.waitForURL(/inventory/);
       await use(page);
     },
   });

   export { test, expect };
   ```
2. Add a global `afterEach` in the fixture to attach a screenshot on failure.
3. Refactor tests to import `test` from the fixture, not from `@playwright/test`:
   ```javascript
   import { test, expect } from '../../fixtures/baseFixture.js';

   test('valid login', async ({ loginPage, inventoryPage }) => {
     await loginPage.open();
     await loginPage.login('standard_user', 'secret_sauce');
     expect(await inventoryPage.isLoaded()).toBeTruthy();
   });
   ```

💡 Why It Matters: Fixtures are Playwright's dependency injection. Setup/teardown happens automatically and consistently. `loggedInPage` removes login boilerplate from every non-login test.

✅ Best Practices:
- Each fixture is lazy — only created when a test asks for it.
- Put shared setup (auto-login, data generator) here.
- Always export a single `{ test, expect }` from the fixture as the team's entry point.

⚠️ Common Mistakes:
- Importing `test` from `@playwright/test` in some specs and the fixture in others → confusing, inconsistent.
- Doing heavy work in a fixture that most tests don't need (slows everything).
- Forgetting to `await use(...)` — the fixture won't provide its value.

🧪 Run & Prove: Tests are now 3–4 lines shorter each; login tests still work.

---

<a id="session-6"></a>
🧩 Session 6 — Utilities Layer

🎯 Goal: Extract repeated logic (waits, parsing, data generation, assertions) into reusable `utils/`.

😖 The Pain (from S5): Tests re-implement price parsing (`$29.99` → `29.99`), custom retry loops, and repeated assertion patterns.

🛠️ Build Live (introduce each as its pain appears):

| File | Introduce when students need... |
| ---- | ------------------------------- |
| `utils/waitUtils.js` | a flaky action to retry → `retry()`, `waitUntil()`, `sleep()` |
| `utils/stringUtils.js` | to compare prices/sorting → `parsePrice()`, `toCurrency()`, `slugify()` |
| `utils/dataGenerator.js` | unique test data → `randomInt()`, `email()`, `customer()` |
| `utils/assertionUtils.js` | readable, logged checks → `assertEquals()`, `assertVisible()` |
| `utils/dateUtils.js`, `fileUtils.js` | date formatting / file I/O when needed |

Example — `waitUtils.js`:
```javascript
export async function retry(fn, { retries = 3, delay = 1000, name = 'action' } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (err) { lastError = err; if (attempt < retries) await sleep(delay); }
  }
  throw lastError;
}
```

💡 Why It Matters: Utilities keep tests and pages thin and readable. Logic is written once, tested once, reused everywhere.

✅ Best Practices:
- Keep utils pure and framework-agnostic where possible (easy to unit-test — see Session 10).
- No third-party bloat: `dataGenerator` replaces Faker; native `fetch`/Playwright request replaces Axios.

⚠️ Common Mistakes:
- Turning `utils/` into a dumping ground of unrelated functions — group by concern.
- Building helpers nobody uses yet ("You Aren't Gonna Need It" — build on demand).

🧪 Run & Prove: Use `parsePrice` in an inventory sort test to prove numeric sorting works.

---

<a id="session-7"></a>
🧩 Session 7 — Data-Driven Testing

🎯 Goal: Run the same test logic across many data sets from external JSON.

😖 The Pain (from S6): We have separate copy-pasted tests for invalid username, invalid password, empty username, locked-out user... They differ only by data.

🛠️ Build Live (in order):

1. `test-data/loginData.json` — arrays of scenarios (`testId`, `username`, `password`, `expectedError`).
2. `test-data/checkoutData.json`, `users.json`, `products.json`.
3. `utils/dataReader.js` — `readJSON(fileName)` / `readCSV(fileName)`.
4. Loop to generate tests dynamically:
   ```javascript
   import { readJSON } from '../../utils/dataReader.js';
   const data = readJSON('loginData.json');

   for (const scenario of data.invalidCredentials) {
     test(`${scenario.testId}: ${scenario.description}`, async ({ loginPage }) => {
       await loginPage.open();
       await loginPage.login(scenario.username, scenario.password);
       expect(await loginPage.getErrorMessage()).toContain(scenario.expectedError);
     });
   }
   ```

💡 Why It Matters: This is the "Data-Driven" in the framework's name. Test data is separated from test logic. Adding a scenario = adding a JSON row, not code.

✅ Best Practices:
- Give every data row a stable `testId` for traceability.
- Keep expected results (`expectedError`) in the data, not the code.
- Loop outside `test()` so each row becomes its own reported test.

⚠️ Common Mistakes:
- Putting the loop inside one `test()` — a single failure hides the rest and you get one giant test.
- Hard-coding data in the spec instead of JSON.
- Reusing mutable data across tests (each test should be independent).

🧪 Run & Prove: Show the report now lists one line per data scenario.

---

<a id="session-8"></a>
🧩 Session 8 — Logging & Reporting

🎯 Goal: Turn "it failed" into actionable evidence: structured logs, screenshots, videos, traces, and rich reports.

😖 The Pain (from S7): A test failed on CI. Why? No logs, no screenshot, no idea.

🛠️ Build Live (in order):

1. `utils/logger.js` — Winston logger → colored console + `logs/test-execution.log` + `logs/error.log`. Wire it into `BasePage` so every action is logged.
2. Add reporters + artifacts in `playwright.config.js`:
   ```javascript
   reporter: [
     ['list'],
     ['html', { outputFolder: 'reports/html-report' }],
     ['json', { outputFile: 'reports/json-report/results.json' }],
     ['junit', { outputFile: 'reports/junit-report/results.xml' }],
     ['allure-playwright', { outputFolder: 'reports/allure-results' }],
   ],
   use: {
     screenshot: 'only-on-failure',
     video: 'retain-on-failure',
     trace: 'retain-on-failure',
   },
   ```
3. `global-setup.js` — write Allure `environment.properties` (env, browser, Node, OS).
4. Install `allure-playwright` + `allure-commandline`; add scripts:
   ```json
   "allure:serve": "allure serve reports/allure-results"
   ```

💡 Why It Matters:
- Logs tell the story of execution.
- Screenshots/videos/traces show the exact failure state.
- Trace Viewer (built-in, no third-party lib) is a time-travel debugger — DOM snapshots, network, console per step.
- Allure/JUnit/JSON integrate with CI dashboards.

✅ Best Practices:
- Use `*-on-failure` modes so artifacts don't bloat successful runs.
- Tag tests (`@smoke`, `@regression`) so reports and runs can be filtered.
- Keep `reports/` and `logs/` git-ignored.

⚠️ Common Mistakes:
- Setting `trace: 'on'` always → huge disk usage. Use `retain-on-failure`.
- `console.log` debugging instead of the structured logger.
- Committing the generated `reports/` folder.

🧪 Run & Prove:
```powershell
npx playwright test        # let one test fail on purpose
npx playwright show-trace  # open the trace of the failure
npm run allure:serve
```

---

<a id="session-9"></a>
🧩 Session 9 — Cross-Browser & Parallel Execution

🎯 Goal: Run the suite on Chromium, Firefox, and WebKit, in parallel, with CI retries.

😖 The Pain (from S8): "It works on my Chrome" — but does it work on Firefox/Safari? And the suite is slow run serially.

🛠️ Build Live (in order):

1. Add `projects[]` to `playwright.config.js`:
   ```javascript
   projects: [
     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
     { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
   ],
   ```
2. Enable parallelism & CI-aware settings:
   ```javascript
   fullyParallel: true,
   workers: process.env.CI ? 2 : undefined,
   retries: process.env.CI ? 2 : 0,
   ```
3. Add browser-specific npm scripts (`test:chromium`, `test:firefox`, `test:webkit`).

💡 Why It Matters: Real users use different browsers. Parallelism cuts execution time dramatically. Retries on CI absorb transient flakiness without masking real bugs (retry only on CI, never locally where you want to *see* flakiness).

✅ Best Practices:
- Tests must be independent (no shared state) to run in parallel safely.
- `retries` only on CI; `0` locally.
- Let workers auto-scale locally; cap them on CI for stability.

⚠️ Common Mistakes:
- Tests that depend on execution order break under parallelism.
- Shared logged-in state / shared files causing race conditions.
- Setting high retries to "fix" flaky tests instead of fixing the root cause.

🧪 Run & Prove:
```powershell
npx playwright test                    # all browsers, parallel
npx playwright test --project=firefox  # single browser
```

---

<a id="session-10"></a>
🧩 Session 10 — Unit Testing

🎯 Goal: Broaden coverage beyond functional flows.

😖 The Pain (from S9): Functional tests pass, but our own utility helpers are untested — a broken helper can silently break many UI tests.

🛠️ Build Live (in order):

1. Unit tests — `tests/unit/*.unit.spec.js` for `waitUtils`, `stringUtils`, `dateUtils`, `dataGenerator` (pure-logic tests, no browser).

💡 Why It Matters: A production framework tests behavior and its own helpers. Unit-testing utils proves the framework's foundation is solid.

✅ Best Practices:
- Keep unit tests fast and browser-free.
- Test edge cases (empty strings, boundary dates, etc.).

⚠️ Common Mistakes:
- Skipping utility tests because "they're just helpers" — they're used everywhere.

🧪 Run & Prove:
```powershell
npx playwright test tests/unit
```

---

<a id="session-11"></a>
🧩 Session 11 — CI/CD

🎯 Goal: Run the suite automatically on every push.

😖 The Pain (from S10): "It runs on my machine." Different Node versions, no automated runs on merge.

🛠️ Build Live (in order):

1. `.github/workflows/playwright.yml` — GitHub Actions with a browser matrix, runs on push/PR, uploads report artifacts.
2. `Jenkinsfile` — parametrized pipeline (`BROWSER`, `SUITE`) with stages: Checkout → Install Deps → Install Browsers → Run Tests → Generate Reports → Archive.

💡 Why It Matters: CI/CD makes testing continuous and reproducible. This is what makes the framework production-ready.

✅ Best Practices:
- Use `npm ci` (not `npm install`) in CI for reproducible installs from the lockfile.
- Always archive reports/artifacts as CI outputs.
- Set `CI=true` so retries and capped workers kick in.

⚠️ Common Mistakes:
- Forgetting `npx playwright install --with-deps` in CI (missing system libs).
- Not uploading artifacts — failures become undebuggable.
- Running headed in CI (must be headless).

🧪 Run & Prove:
```powershell
npm run test:smoke
npm run allure:serve
```

---

<a id="session-12"></a>
🧩 Session 12 — Final Execution Flow & Wrap-Up

🎯 Goal: Run the entire framework end to end and trace exactly what happens at each stage.

🛠️ Do Live:
```powershell
npm run test:smoke        # fast critical-path run
npm test                  # full suite, all browsers, parallel
npm run allure:serve      # rich report
```

Then walk the class through the [Final Execution Flow](#final-execution-flow) diagram below, mapping each stage to the file that implements it.

💡 Wrap-Up message to students: _"We started with one messy test. Every folder we added solved a real pain. That's how real frameworks are born — not designed all at once, but grown deliberately."_

---

Folder Structure — What & Why

Introduce each folder only when its first file is needed — never up front.

```
saucedemo-framework/
├── config/            # WHY: externalize environment settings (dev/qa/staging) — Session 4
│   └── environments/  # per-environment JSON (URLs, credentials)
├── pages/             # WHY: Page Object Model — one class per screen — Sessions 2–3
├── fixtures/          # WHY: dependency injection of page objects & setup — Session 5
├── utils/             # WHY: reusable, framework-agnostic helpers — Session 6
├── test-data/         # WHY: external data for data-driven tests — Session 7
├── tests/             # WHY: specs organized by feature (login/inventory/cart/...) — Session 1+
│   ├── login/ inventory/ cart/ checkout/   # functional, by module
│   ├── unit/                                # unit coverage — Session 10
├── reports/           # WHY: generated HTML/JSON/JUnit/Allure output (git-ignored) — Session 8
├── logs/              # WHY: Winston execution & error logs (git-ignored) — Session 8
├── .github/workflows/ # WHY: GitHub Actions CI — Session 11
├── playwright.config.js  # central test config — grows across all sessions
├── config/env.config.js  # config loader — Session 4
├── global-setup.js       # one-time setup (Allure env info) — Session 8
├── Jenkinsfile           # Jenkins pipeline — Session 11
├── .env / .env.example   # secrets & template — Session 4
└── package.json          # scripts & dependencies — Session 0
```

Rule to teach: _A folder exists because a responsibility exists._ Separation of concerns is the reason for every directory.

---

Common Mistakes Students Make

A consolidated list to keep on a slide — revisit these throughout the course:

| # | Mistake | Fix |
| - | ------- | --- |
| 1 | Skipping `npm init` and writing loose scripts | Always initialize the project first |
| 2 | Hard-coding selectors in tests | Move to Page Objects (POM) |
| 3 | `waitForTimeout(5000)` everywhere | Trust auto-waiting / web-first assertions |
| 4 | Missing `await` on async calls | Every Playwright call is awaited |
| 5 | Assertions inside Page Objects | Assertions belong in specs |
| 6 | Forgetting `super(page)` in child pages | Always call `super()` first |
| 7 | Hard-coded URLs/users/timeouts | Centralize in `config/env.config.js` |
| 8 | Committing `.env` with secrets | Git-ignore `.env`; commit `.env.example` |
| 9 | Data loop inside one `test()` | Loop outside `test()` — one test per row |
| 10 | Leaving `test.only` in code | Remove before commit; `forbidOnly` blocks it in CI |
| 11 | `trace: 'on'` always | Use `retain-on-failure` |
| 12 | Order-dependent tests | Keep tests independent for parallelism |
| 13 | High retries to hide flakiness | Fix the root cause; retry only on CI |
| 14 | Committing `node_modules/`, `reports/`, `logs/` | Git-ignore generated folders |
| 15 | `npm install` in CI | Use `npm ci` for reproducibility |

---

Final Execution Flow

When you run `npm test`, this is the journey — map each stage to its file:

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. CLI: `npm test`  →  runs `playwright test` (package.json script)     │
├──────────────────────────────────────────────────────────────────────┤
│ 2. Playwright reads playwright.config.js                               │
│    • testDir, timeout, retries, workers, reporters, projects, use{}    │
│    • baseURL/headless pulled from config/env.config.js (reads ENV)     │
├──────────────────────────────────────────────────────────────────────┤
│ 3. global-setup.js runs ONCE  →  writes Allure environment.properties  │
├──────────────────────────────────────────────────────────────────────┤
│ 4. Test discovery: finds all *.spec.js under tests/                    │
├──────────────────────────────────────────────────────────────────────┤
│ 5. Worker allocation: fullyParallel spreads tests across workers,      │
│    once per project (chromium / firefox / webkit)                      │
├──────────────────────────────────────────────────────────────────────┤
│ 6. For each test:                                                      │
│    a. Browser context + page launched                                  │
│    b. Fixtures resolve (baseFixture.js): loginPage, inventoryPage,     │
│       loggedInPage (auto-login), api, data                             │
│    c. Data-driven specs read JSON via utils/dataReader.js              │
│    d. Test body runs → Page Objects → BasePage actions → Winston logs  │
│    e. Assertions auto-retry until expect.timeout                       │
│    f. afterEach: on failure → screenshot/video/trace attached          │
├──────────────────────────────────────────────────────────────────────┤
│ 7. Retries (CI only): failed tests re-run up to `retries`             │
├──────────────────────────────────────────────────────────────────────┤
│ 8. Reporters emit output:                                             │
│    list (console) • HTML • JSON • JUnit XML • Allure results          │
├──────────────────────────────────────────────────────────────────────┤
│ 9. View results:                                                     │
│    npx playwright show-report   |   npm run allure:serve             │
│    npx playwright show-trace <trace.zip>  (time-travel debugging)     │
└──────────────────────────────────────────────────────────────────────┘
```

From first test to full suite:
```
Write test → run single (npx playwright test file) → debug (--debug / trace)
   → tag it (@smoke) → run suite (npm test) → view report (allure:serve)
   → commit → push (CI runs matrix) → artifacts archived
```

---

Trainer's Quick Checklist

Print this and keep it beside you each class:

- [ ] Session 0–1: `npm init`, install Playwright, minimal config, first raw test passes.
- [ ] Session 2–3: Refactor to POM, then extract `BasePage` (teach OOP live).
- [ ] Session 4: Externalize config + environments; `ENV=staging` switch works.
- [ ] Session 5: Fixtures inject page objects; `loggedInPage` auto-login works.
- [ ] Session 6: Utilities extracted (`waitUtils`, `stringUtils`, `dataGenerator`).
- [ ] Session 7: Data-driven login/checkout from JSON; one test per row in report.
- [ ] Session 8: Winston logs + screenshots/video/trace + Allure report.
- [ ] Session 9: Cross-browser projects, parallel workers, CI retries.
- [ ] Session 10: Unit tests added.
- [ ] Session 11: GitHub Actions, Jenkinsfile — CI green.
- [ ] Session 12: Full suite runs end to end; walk the execution flow diagram.

Remember: Build by pain, explain the *why*, run after every step, and let the framework earn each file. Good luck in class! 🎓
```
