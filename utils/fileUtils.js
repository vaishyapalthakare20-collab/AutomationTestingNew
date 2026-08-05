import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

/**
 * fileUtils - reusable filesystem helpers for downloads, reports,
 * temp files and cleanup. Common in real frameworks for verifying
 * downloaded files and managing artifacts.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

/** Resolve a path relative to the framework root. */
export function fromRoot(...segments) {
  return path.join(ROOT_DIR, ...segments);
}

/** Whether a file or directory exists. */
export function exists(filePath) {
  return fs.existsSync(filePath);
}

/** Create a directory (recursively) if it doesn't exist. */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
}

/** Read a file as UTF-8 text. */
export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/** Write text to a file (creates parent dirs). */
export function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  logger.info(`Wrote file: ${filePath}`);
}

/** Append text to a file. */
export function appendText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, content, 'utf-8');
}

/** Delete a file if it exists. */
export function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logger.info(`Deleted file: ${filePath}`);
  }
}

/** Get a file's size in bytes (0 if missing). */
export function fileSize(filePath) {
  return fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
}

/**
 * Save a Playwright Download to a target path and return it.
 * @param {import('@playwright/test').Download} download
 * @param {string} targetPath
 */
export async function saveDownload(download, targetPath) {
  ensureDir(path.dirname(targetPath));
  await download.saveAs(targetPath);
  logger.info(`Saved download to: ${targetPath}`);
  return targetPath;
}

export default {
  fromRoot,
  exists,
  ensureDir,
  readText,
  writeText,
  appendText,
  deleteFile,
  fileSize,
  saveDownload,
};
