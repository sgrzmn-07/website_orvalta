const { loadConfig } = require("./config");
const { validateCliArgs, validateInputFile } = require("./validate");
const { parseMarkdownPost } = require("./markdown");
const { createDraftPost } = require("./wordpress");

async function main() {
  const inputPath = process.argv[2];

  validateCliArgs(inputPath);

  const config = loadConfig();
  const { resolvedPath, rawContent } = validateInputFile(inputPath);
  const parsedPost = parseMarkdownPost(rawContent);

  const result = await createDraftPost(config, {
    title: parsedPost.title,
    content: parsedPost.bodyHtml
  });

  console.log(`Draft created successfully from: ${resolvedPath}`);
  console.log(`Post ID: ${result.id}`);
  console.log(`Status: ${result.status || "draft"}`);

  if (result.link) {
    console.log(`Link: ${result.link}`);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
