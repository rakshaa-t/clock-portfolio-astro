#!/usr/bin/env node
// Usage: node scripts/add-book.mjs "Book Title" "Author Name"

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BOOKS_JSON = path.join(ROOT, 'src', 'data', 'books.json');
const BOOKS_DIR = path.join(ROOT, 'public', 'books');

// ── Helpers ──

function fetch(url) {
  return new Promise((resolve, reject) => {
    const get = (u, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let loc = res.headers.location;
          if (loc.startsWith('/')) {
            const parsed = new URL(u);
            loc = `${parsed.protocol}//${parsed.host}${loc}`;
          }
          return get(loc, redirects + 1);
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
          let loc = res.headers.location;
          if (loc.startsWith('/')) {
            const parsed = new URL(u);
            loc = `${parsed.protocol}//${parsed.host}${loc}`;
          }
          return get(loc, redirects + 1);
        }
        if (res.statusCode !== 200) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
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

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Main ──

async function main() {
  const title = process.argv[2];
  const author = process.argv[3];

  if (!title || !author) {
    console.error('Usage: node scripts/add-book.mjs "Book Title" "Author Name"');
    process.exit(1);
  }

  const slug = slugify(title);
  console.log(`Title: ${title}`);
  console.log(`Author: ${author}`);
  console.log(`Slug: ${slug}`);

  if (!fs.existsSync(BOOKS_DIR)) {
    fs.mkdirSync(BOOKS_DIR, { recursive: true });
  }

  const coverDest = path.join(BOOKS_DIR, `${slug}.jpg`);
  let coverSaved = false;

  // Try Open Library cover by title
  const encodedTitle = encodeURIComponent(title);
  const titleCoverUrl = `https://covers.openlibrary.org/b/title/${encodedTitle}-L.jpg`;

  console.log('Trying Open Library cover by title...');
  try {
    await downloadFile(titleCoverUrl, coverDest);
    const stat = fs.statSync(coverDest);
    if (stat.size < 1024) {
      // Likely a 1x1 placeholder — remove and try fallback
      fs.unlinkSync(coverDest);
      console.log('Cover too small (placeholder), trying fallback...');
    } else {
      coverSaved = true;
      console.log(`Saved cover: public/books/${slug}.jpg`);
    }
  } catch {
    console.log('Title cover not available, trying fallback...');
  }

  // Fallback: search Open Library for OLID, then fetch cover by OLID
  if (!coverSaved) {
    const encodedAuthor = encodeURIComponent(author);
    const searchUrl = `https://openlibrary.org/search.json?title=${encodedTitle}&author=${encodedAuthor}&limit=1`;
    console.log('Searching Open Library...');
    try {
      const { body } = await fetch(searchUrl);
      const data = JSON.parse(body.toString('utf-8'));
      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        // Try cover_edition_key (OLID) first
        const olid = doc.cover_edition_key || (doc.edition_key && doc.edition_key[0]);
        if (olid) {
          const olidCoverUrl = `https://covers.openlibrary.org/b/olid/${olid}-L.jpg`;
          console.log(`Found OLID: ${olid}, downloading cover...`);
          try {
            await downloadFile(olidCoverUrl, coverDest);
            const stat = fs.statSync(coverDest);
            if (stat.size < 1024) {
              fs.unlinkSync(coverDest);
              console.log('OLID cover too small (placeholder).');
            } else {
              coverSaved = true;
              console.log(`Saved cover: public/books/${slug}.jpg`);
            }
          } catch {
            console.log('Could not download OLID cover.');
          }
        }
        // Try cover_i (cover ID) as another fallback
        if (!coverSaved && doc.cover_i) {
          const coverIdUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          console.log(`Trying cover ID: ${doc.cover_i}...`);
          try {
            await downloadFile(coverIdUrl, coverDest);
            const stat = fs.statSync(coverDest);
            if (stat.size < 1024) {
              fs.unlinkSync(coverDest);
            } else {
              coverSaved = true;
              console.log(`Saved cover: public/books/${slug}.jpg`);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn(`Open Library search failed: ${err.message}`);
    }
  }

  if (!coverSaved) {
    console.warn('Warning: Could not download a cover image. Please add one manually.');
    console.warn(`Expected path: public/books/${slug}.jpg`);
  }

  // Read existing books.json
  if (!fs.existsSync(BOOKS_JSON)) {
    console.error(`Data file not found: ${BOOKS_JSON}`);
    console.error('Make sure src/data/books.json exists.');
    process.exit(1);
  }

  const books = JSON.parse(fs.readFileSync(BOOKS_JSON, 'utf-8'));

  // Build new entry
  const entry = {
    title,
    author,
    cover: `/books/${slug}.jpg`,
    progress: 1,
    subtitle: '',
    notes: [{ note: 'Getting started with this one.' }],
  };

  // Insert at index 1 (after the first item, near the top)
  if (books.length > 0) {
    books.splice(1, 0, entry);
  } else {
    books.push(entry);
  }

  // Write back
  fs.writeFileSync(BOOKS_JSON, JSON.stringify(books, null, 2) + '\n', 'utf-8');

  console.log(`\nAdded: ${title} by ${author}`);
  console.log('Remember to fill in the "subtitle" field in src/data/books.json');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
