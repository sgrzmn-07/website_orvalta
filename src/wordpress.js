const axios = require("axios");

function buildAuthHeader(username, appPassword) {
  const token = Buffer.from(`${username}:${appPassword}`).toString("base64");
  return `Basic ${token}`;
}

function formatWordPressError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "WordPress API request failed.";

    return `WordPress API error (${status}): ${message}`;
  }

  if (error.request) {
    return "Network error: unable to reach the WordPress site.";
  }

  return error.message || "Unexpected error while calling WordPress.";
}

async function createDraftPost(config, post) {
  try {
    const response = await axios.post(
      `${config.wpBaseUrl}/wp-json/wp/v2/posts`,
      {
        title: post.title,
        content: post.content,
        status: "draft"
      },
      {
        headers: {
          Authorization: buildAuthHeader(
            config.wpUsername,
            config.wpAppPassword
          ),
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(formatWordPressError(error));
  }
}

module.exports = {
  createDraftPost
};
