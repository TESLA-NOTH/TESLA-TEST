const axios = require('axios');

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'TESLA-NOTH';
const REPO_NAME = 'TESLA-SESSIONS';
const BRANCH = 'main';
const SESSION_PATH = 'users-info';

// ذخیره config
async function saveUserConfig(userId, config) {
  const content = JSON.stringify(config, null, 2);
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SESSION_PATH}/${userId}.json`;

  try {
    let sha = null;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'TeslaBot'
        }
      });
      sha = data.sha;
    } catch {
      // فایل وجود ندارد، ایجاد می‌شود
    }

    await axios.put(url, {
      message: `Update config for ${userId}`,
      content: Buffer.from(content).toString('base64'),
      branch: BRANCH,
      sha: sha || undefined
    }, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'TeslaBot'
      }
    });

    return true;

  } catch (err) {
    console.error("[ERROR] GitHub save failed:", err.response?.data || err.message);
    return false;
  }
}

// خواندن config کاربر
async function getUserConfig(userId) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SESSION_PATH}/${userId}.json`;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'TeslaBot'
      }
    });

    const content = Buffer.from(data.content, 'base64').toString();
    return JSON.parse(content);

  } catch (err) {
    console.log(`[INFO] No config for user ${userId}, using default.`);
    return null;
  }
}

module.exports = { saveUserConfig, getUserConfig };