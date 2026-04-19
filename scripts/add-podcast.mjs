#!/usr/bin/env node
// Usage: node scripts/add-podcast.mjs https://youtu.be/VIDEO_ID
// Or:    node scripts/add-podcast.mjs https://www.youtube.com/watch?v=VIDEO_ID

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PODCASTS_JSON = path.join(ROOT, 'src', 'data', 'podcasts.json');
const PODCASTS_DIR = path.join(ROOT, 'public', 'podcasts');

// ── Helpers ──

function fetch(url) {
  return new Promise((resolve, reject) => {
    const get = (u, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirects + 1);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
        res.on('error', reject);
      }).on('error', reject);
    };
    get(url);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
    };
    get(url);
  });
}

function extractVideoId(input) {
  // youtu.be/ID
  let m = input.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // youtube.com/watch?v=ID
  m = input.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // youtube.com/embed/ID
  m = input.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

// ── Main ──

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scripts/add-podcast.mjs <youtube-url>');
    process.exit(1);
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    console.error('Could not extract video ID from URL:', url);
    process.exit(1);
  }

  console.log(`Video ID: ${videoId}`);

  // Fetch YouTube page to extract metadata
  const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
  console.log('Fetching YouTube page...');
  const { body } = await fetch(ytUrl);
  const html = body.toString('utf-8');

  // Extract title from <title> tag
  let title = '';
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    title = titleMatch[1].replace(/\s*-\s*YouTube\s*$/, '').trim();
  }
  if (!title) {
    console.error('Could not extract title from YouTube page.');
    process.exit(1);
  }

  // Extract channel name
  let channel = '';
  const channelMatch = html.match(/<link\s+itemprop="name"\s+content="([^"]+)"/);
  if (channelMatch) {
    channel = channelMatch[1].trim();
  }
  if (!channel) {
    // Fallback: try og:site_name or other patterns
    const altMatch = html.match(/"ownerChannelName"\s*:\s*"([^"]+)"/);
    if (altMatch) channel = altMatch[1].trim();
  }
  if (!channel) {
    console.warn('Warning: Could not extract channel name. Please fill it in manually.');
  }

  console.log(`Title: ${title}`);
  console.log(`Channel: ${channel || '(unknown)'}`);

  // Download thumbnail
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbDest = path.join(PODCASTS_DIR, `${videoId}.jpg`);

  if (!fs.existsSync(PODCASTS_DIR)) {
    fs.mkdirSync(PODCASTS_DIR, { recursive: true });
  }

  console.log('Downloading thumbnail...');
  try {
    await downloadFile(thumbUrl, thumbDest);
    console.log(`Saved thumbnail: public/podcasts/${videoId}.jpg`);
  } catch (err) {
    console.warn(`Warning: Could not download thumbnail (${err.message}). You may need to add it manually.`);
  }

  // Read existing podcasts.json
  if (!fs.existsSync(PODCASTS_JSON)) {
    console.error(`Data file not found: ${PODCASTS_JSON}`);
    console.error('Make sure src/data/podcasts.json exists.');
    process.exit(1);
  }

  const podcasts = JSON.parse(fs.readFileSync(PODCASTS_JSON, 'utf-8'));

  // Build new entry
  const entry = {
    title,
    guest: '',
    channel: channel || '',
    cover: `/podcasts/${videoId}.jpg`,
    url: `https://youtu.be/${videoId}`,
    note: '',
  };

  // Newest entries go at index 0 so the latest podcast appears at the top
  // of the section. See feedback memory: project rule for podcasts ordering.
  podcasts.unshift(entry);

  // Write back
  fs.writeFileSync(PODCASTS_JSON, JSON.stringify(podcasts, null, 2) + '\n', 'utf-8');

  console.log(`\nAdded: ${title} by ${channel || '(unknown channel)'}`);
  console.log('Remember to fill in the "guest" and "note" fields in src/data/podcasts.json');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
