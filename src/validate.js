const fs = require("fs");
const path = require("path");

function createError(message) {
  return new Error(message);
}

function validateRequiredEnv(config) {
  const missing = [];

  if (!config.wpBaseUrl) {
    missing.push("WP_BASE_URL");
  }

  if (!config.wpUsername) {
    missing.push("WP_USERNAME");
  }

  if (!config.wpAppPassword) {
    missing.push("WP_APP_PASSWORD");
  }

  if (missing.length > 0) {
    throw createError(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

function validateCliArgs(filePath) {
  if (!filePath) {
    throw createError("Usage: node src/publish.js <path-to-markdown-file>");
  }
}

function validateInputFile(filePath) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw createError(`Markdown file not found: ${resolvedPath}`);
  }

  const stats = fs.statSync(resolvedPath);

  if (!stats.isFile()) {
    throw createError(`Input path is not a file: ${resolvedPath}`);
  }

  const rawContent = fs.readFileSync(resolvedPath, "utf8").replace(/^\uFEFF/, "");

  const hasContent = rawContent.split(/\r?\n/).some((line) => line.trim() !== "");

  if (!hasContent) {
    throw createError("Markdown file is empty or contains only whitespace.");
  }

  return {
    resolvedPath,
    rawContent
  };
}

function validateParsedMarkdown(title, bodyMarkdown) {
  if (!title) {
    throw createError("First line must be a markdown H1 (# Title)");
  }

  if (!bodyMarkdown || !bodyMarkdown.trim()) {
    throw createError("Markdown body content is required after the title.");
  }
}

module.exports = {
  validateRequiredEnv,
  validateCliArgs,
  validateInputFile,
  validateParsedMarkdown
};
