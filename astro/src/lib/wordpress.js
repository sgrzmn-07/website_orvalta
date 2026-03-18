const DEFAULT_WORDPRESS_API_BASE_URL = "https://orvalta.com/wp-json/wp/v2";
const WORDPRESS_FETCH_TIMEOUT_MS = 15000;

function getWordPressApiBaseUrl() {
  const rawBaseUrl =
    import.meta.env.WORDPRESS_API_BASE_URL || DEFAULT_WORDPRESS_API_BASE_URL;

  const normalizedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

  try {
    return new URL(`${normalizedBaseUrl}/`);
  } catch {
    throw new Error(
      "Invalid WORDPRESS_API_BASE_URL. Expected a full URL like https://orvalta.com/wp-json/wp/v2"
    );
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WORDPRESS_FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `WordPress API request timed out after ${WORDPRESS_FETCH_TIMEOUT_MS}ms`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWordPress(path, params = {}) {
  const url = new URL(path, getWordPressApiBaseUrl());

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  let response;

  try {
    response = await fetchWithTimeout(url, {
      headers: {
        Accept: "application/json"
      }
    });
  } catch (error) {
    throw new Error(`Failed to fetch ${url.toString()}: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(
      `WordPress API request failed for ${url.toString()}: ${response.status} ${response.statusText}`
    );
  }

  return response;
}

async function getAllPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetchWordPress("posts", {
      page,
      per_page: 100,
      status: "publish",
      orderby: "date",
      order: "desc",
      _fields: "id,slug,date,link,title"
    });

    const pagePosts = await response.json();

    if (!Array.isArray(pagePosts)) {
      throw new Error("WordPress API returned an unexpected posts response.");
    }

    posts.push(...pagePosts);
    totalPages = Number(response.headers.get("x-wp-totalpages") || 1);
    page += 1;
  } while (page <= totalPages);

  return posts;
}

async function getPostBySlug(slug) {
  const response = await fetchWordPress("posts", {
    slug,
    per_page: 1,
    status: "publish",
    _fields: "id,slug,date,link,title,content"
  });

  const posts = await response.json();

  if (!Array.isArray(posts)) {
    throw new Error("WordPress API returned an unexpected single-post response.");
  }

  return posts[0] || null;
}

function formatPostDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(dateString));
}

export {
  getAllPosts,
  getPostBySlug,
  formatPostDate
};
