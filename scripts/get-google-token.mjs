/**
 * Run with: node scripts/get-google-token.mjs
 * Opens a browser, you click Allow, refresh token is printed here.
 */
import http from 'http';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Read CLIENT_ID and CLIENT_SECRET from .env
function readEnv() {
  const content = readFileSync(envPath, 'utf8');
  const get = (key) => {
    const match = content.match(new RegExp(`^${key}=(.+)$`, 'm'));
    return match ? match[1].trim() : null;
  };
  return {
    clientId: get('GOOGLE_ADS_CLIENT_ID'),
    clientSecret: get('GOOGLE_ADS_CLIENT_SECRET'),
  };
}

const { clientId, clientSecret } = readEnv();

console.log('Using Client ID:', clientId);
console.log('Secret ends with:', clientSecret?.slice(-6));

const REDIRECT_URI = 'http://localhost:9999/callback';
const SCOPE = 'https://www.googleapis.com/auth/adwords';

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${encodeURIComponent(clientId)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n🔑 Opening browser for Google authorization...\n');

// Start local server to catch the redirect
const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) return;

  const code = new URL(req.url, 'http://localhost:9999').searchParams.get('code');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2 style="font-family:sans-serif;padding:40px">✅ Authorized! You can close this tab and check your terminal.</h2>');

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  server.close();

  if (tokens.refresh_token) {
    console.log('✅ Success! Your new refresh token:\n');
    console.log('GOOGLE_ADS_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\n👉 Paste this line into your .env file (replace the existing GOOGLE_ADS_REFRESH_TOKEN line).\n');
  } else {
    console.error('❌ No refresh token received. Response:', tokens);
  }
});

server.listen(9999, () => {
  // Open browser
  exec(`open "${authUrl}"`);
  console.log('If the browser did not open, visit this URL manually:\n' + authUrl + '\n');
});
