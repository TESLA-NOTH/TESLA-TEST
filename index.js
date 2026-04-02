import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'TESLA-NOTH';
const REPO_NAME = 'TESLA-SESSIONS';
const BRANCH = 'main';
const SESSION_PATH = 'host-users';
const RENDER_API_KEY = 'rnd_kIhw5Kdlk8vAhDY0HlW8lpoGG2Mr';
const RENDER_OWNER_ID = 'tea-d75b4slm5p6s73c9f8rg';
const GITHUB_REPO = 'https://github.com/TESLA-NOTH/TESLA-TEST';

app.use(express.json());
app.use(express.static(__dirname));

async function saveUserConfig(userId, config) {
  const content = JSON.stringify(config, null, 2);
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SESSION_PATH}/${userId}.json`;
  try {
    let sha = null;
    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'TeslaBot' }
      });
      sha = data.sha;
    } catch {}
    await axios.put(url, {
      message: `Update config for ${userId}`,
      content: Buffer.from(content).toString('base64'),
      branch: BRANCH,
      ...(sha && { sha })
    }, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'TeslaBot' }
    });
    return true;
  } catch (err) {
    console.error('[ERROR] GitHub save failed:', err.response?.data || err.message);
    return false;
  }
}

async function getUserConfig(userId) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SESSION_PATH}/${userId}.json`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'TeslaBot' }
    });
    const content = Buffer.from(data.content, 'base64').toString();
    return JSON.parse(content);
  } catch {
    return null;
  }
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'home.html'));
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  const existing = await getUserConfig(username);
  if (existing) return res.status(409).json({ error: 'Username already exists' });
  const config = { username, password, coins: 0, bots: [] };
  const saved = await saveUserConfig(username, config);
  if (saved) res.json({ success: true, user: { username, coins: 0, bots: [] } });
  else res.status(500).json({ error: 'Failed to create account' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserConfig(username);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid username or password' });
  res.json({ success: true, user: { username: user.username, coins: user.coins, bots: user.bots, lastEarn: user.lastEarn || 0 } });
});

app.post('/api/earn', async (req, res) => {
  const { username } = req.body;
  const user = await getUserConfig(username);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const now = Date.now();
  const lastEarn = user.lastEarn || 0;
  const diff = now - lastEarn;
  const cooldown = 24 * 60 * 60 * 1000;

  if (diff < cooldown) {
    const remaining = cooldown - diff;
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return res.status(429).json({ error: `Come back in ${hours}h ${minutes}m` });
  }

  user.coins += 10;
  user.lastEarn = now;
  await saveUserConfig(username, user);
  res.json({ success: true, coins: user.coins });
});

app.post('/api/deploy', async (req, res) => {
  const { username, botName, session } = req.body;
  if (!botName || !session) return res.status(400).json({ error: 'Bot name and session are required' });
  const user = await getUserConfig(username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.coins < 10) return res.status(400).json({ error: 'Not enough coins. Earn more coins first!' });

  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');

  const serviceName = `${botName}-${timestamp}`;

  try {
    const response = await axios.post('https://api.render.com/v1/services', {
      type: 'web_service',
      name: serviceName,
      ownerId: RENDER_OWNER_ID,
      repo: GITHUB_REPO,
      branch: 'main',
      autoDeploy: 'yes',
      envVars: [
        { key: 'NODE_VERSION', value: '20' },
        { key: 'NODE_ENV', value: 'production' },
        { key: 'SESSION_ID', value: session }
      ],
      rootDir: '.',
      serviceDetails: {
        plan: 'free',
        region: 'oregon',
        runtime: 'node',
        previews: { generation: 'off' },
        renderSubdomainPolicy: 'enabled',
        pullRequestPreviewsEnabled: 'no',
        envSpecificDetails: {
          buildCommand: 'npm install',
          startCommand: 'npm start'
        }
      }
    }, {
      headers: { Authorization: `Bearer ${RENDER_API_KEY}`, 'Content-Type': 'application/json' }
    });

    user.coins -= 10;
    const botInfo = {
      name: serviceName,
      url: response.data.service.serviceDetails.url,
      deployId: response.data.deployId,
      deployedAt: new Date().toISOString()
    };
    user.bots.push(botInfo);
    await saveUserConfig(username, user);

    res.json({ success: true, bot: botInfo, coins: user.coins });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
