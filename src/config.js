const dotenv = require("dotenv");
const { validateRequiredEnv } = require("./validate");

function loadConfig() {
  dotenv.config({ quiet: true });

  const config = {
    wpBaseUrl: process.env.WP_BASE_URL,
    wpUsername: process.env.WP_USERNAME,
    wpAppPassword: process.env.WP_APP_PASSWORD
  };

  validateRequiredEnv(config);

  return {
    wpBaseUrl: config.wpBaseUrl.trim().replace(/\/+$/, ""),
    wpUsername: config.wpUsername,
    wpAppPassword: config.wpAppPassword
  };
}

module.exports = {
  loadConfig
};
