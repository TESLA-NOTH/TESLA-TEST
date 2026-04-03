const axios = require('axios');

const REPO_OWNER = 'TESLA-NOTH';
const REPO_NAME = 'TESLA-SESSIONS';
const BRANCH = 'main';
const SESSION_PATH = 'users-info';

let cachedToken = null;

// فقط یک‌بار می‌گیره
async function getToken() {
  if (cachedToken) return cachedToken;

  const res = await axios.get('https://files.catbox.moe/dgsumu.txt');
  cachedToken = res.data.trim();

  return cachedToken;
}

// ذخیره
async function saveUserConfig(userId, config) {
  const GITHUB_TOKEN = await getToken();
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
    } catch {}

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

// خواندن
async function getUserConfig(userId) {
  const GITHUB_TOKEN = await getToken();

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

  } catch {
    return null;
  }
}

module.exports = { saveUserConfig, getUserConfig };