import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Utility helpers for reading external test data (Data-Driven layer).
 * Supports JSON and simple CSV files stored under /test-data.
 */

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'test-data');

/**
 * Read and parse a JSON test-data file.
 * @param {string} fileName e.g. 'loginData.json'
 * @returns {any} parsed JSON object/array
 */
function readJSON(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Read a CSV file and convert it into an array of objects.
 * First row is treated as the header row.
 * @param {string} fileName e.g. 'checkoutData.csv'
 * @returns {Array<Object>} rows as objects keyed by header
 */
function readCSV(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  const [headerLine, ...lines] = content.split(/\r?\n/);
  const headers = headerLine.split(',').map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
}

export { readJSON, readCSV };
