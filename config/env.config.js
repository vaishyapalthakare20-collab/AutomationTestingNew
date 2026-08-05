import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Centralized environment configuration.
 *
 * Supports MULTIPLE environments (dev / qa / staging). Selection order:
 *   1. process.env.ENV        -> loads config/environments/<ENV>.json
 *   2. individual .env vars   -> override any value
 *   3. hard-coded fallbacks   -> so the framework always runs
 *
 * Run against a specific environment:
 *   ENV=staging npx playwright test           (macOS/Linux)
 *   $env:ENV="staging"; npx playwright test   (PowerShell)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_NAME = process.env.ENV || 'qa';

/**
 * Load the environment JSON file. Falls back to an empty object if missing.
 * @returns {object}
 */
function loadEnvFile() {
  const filePath = path.join(__dirname, 'environments', `${ENV_NAME}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  console.warn(`[env.config] No environment file for "${ENV_NAME}", using defaults.`);
  return {};
}

const fileConfig = loadEnvFile();
const fileCreds = fileConfig.credentials || {};
const fileUsers = fileCreds.users || {};

const env = {
  // Which environment is active
  name: fileConfig.name || ENV_NAME,

  // Application under test (env file -> .env -> default)
  baseURL: process.env.BASE_URL || fileConfig.baseURL || 'https://www.saucedemo.com',

  // Common password for all SauceDemo users
  password: process.env.PASSWORD || fileCreds.password || 'secret_sauce',

  // User accounts available on SauceDemo
  users: {
    standard: process.env.STANDARD_USER || fileUsers.standard || 'standard_user',
    lockedOut: process.env.LOCKED_OUT_USER || fileUsers.lockedOut || 'locked_out_user',
    problem: process.env.PROBLEM_USER || fileUsers.problem || 'problem_user',
    performance:
      process.env.PERFORMANCE_USER || fileUsers.performance || 'performance_glitch_user',
    error: process.env.ERROR_USER || fileUsers.error || 'error_user',
  },

  // Timeouts
  timeouts: {
    test: Number(process.env.TEST_TIMEOUT) || 60000,
    expect: Number(process.env.EXPECT_TIMEOUT) || 10000,
    action: Number(process.env.ACTION_TIMEOUT) || 15000,
    navigation: Number(process.env.NAVIGATION_TIMEOUT) || 30000,
  },

  headless: process.env.HEADLESS !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default env;
