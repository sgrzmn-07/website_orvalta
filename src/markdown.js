const { marked } = require("marked");
const { validateParsedMarkdown } = require("./validate");

function parseMarkdownPost(rawContent) {
  const lines = rawContent.split(/\r?\n/);
  const titleLineIndex = lines.findIndex((line) => line.trim() !== "");

  if (titleLineIndex === -1) {
    validateParsedMarkdown("", "");
  }

  const titleLine = lines[titleLineIndex].replace(/^\uFEFF/, "").trim();
  const titleMatch = titleLine.match(/^#\s+(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const bodyMarkdown = lines.slice(titleLineIndex + 1).join("\n").trim();

  validateParsedMarkdown(title, bodyMarkdown);

  return {
    title,
    bodyMarkdown,
    bodyHtml: marked.parse(bodyMarkdown)
  };
}

module.exports = {
  parseMarkdownPost
};
