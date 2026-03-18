# Orvalta WordPress Draft Publisher

Minimal local Node.js utility for sending a Markdown post from VS Code to WordPress as a draft using the WordPress REST API and Application Password authentication.

## What this does

- Reads a local Markdown file
- Uses the first non-empty H1 line as the post title
- Converts the remaining Markdown body to HTML
- Creates a WordPress post with `status: "draft"`

## Requirements

- Node.js 18+
- A WordPress user with permission to create posts
- A WordPress Application Password for that user

## Project files

- `package.json`: project metadata, dependencies, and the `publish` script
- `.gitignore`: keeps secrets and local dependencies out of version control
- `.env.example`: documents required environment variables
- `src/config.js`: loads and validates environment configuration
- `src/validate.js`: validates CLI input and Markdown structure
- `src/markdown.js`: parses Markdown input and converts body content to HTML
- `src/wordpress.js`: sends the post to the WordPress REST API
- `src/publish.js`: CLI entrypoint and orchestration

## Setup

1. Copy `.env.example` to `.env`
2. Fill in `WP_BASE_URL`, `WP_USERNAME`, and `WP_APP_PASSWORD`
3. Use your site base URL only, for example `https://your-site.com`
4. The script trims a trailing slash from `WP_BASE_URL` automatically if you include one
5. Install dependencies:

```powershell
npm.cmd install
```

## Markdown input format

The first non-empty line must be an H1 title:

```md
# Example Post Title

This is the body of the post.
```

Only `title + content` are supported in this version. No frontmatter, excerpt, slug, categories, tags, or featured image are included.

## Run

1. Create a Markdown file, for example `content/example.md`
2. Put the title on the first non-empty line as an H1
3. Add the post body below the title
4. Run the publisher with the file path

Example Markdown:

```md
# Example Post Title

This is the body of the post.
```

Command:

```powershell
node src/publish.js .\content\example.md
```

Or use the package script:

```powershell
npm.cmd run publish -- .\content\example.md
```

## Output

On success, the script prints:

- The source file path
- The new post ID
- The returned WordPress status
- The post link when WordPress includes one

## Notes

- The script fails fast if required environment variables are missing
- It does not publish content live; it always creates drafts
- It does not store credentials in code or commit them to version control

## Next safe step

Add a small frontmatter parser for optional `slug` and `excerpt`, while keeping draft-by-default behavior and the same modular structure.
