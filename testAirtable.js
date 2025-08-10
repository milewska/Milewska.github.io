// Run this script with Node.js to test Airtable API access using your PAT and Base ID from the .env file
import 'dotenv/config';

const API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;

async function testAirtableAccess() {
  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    console.error(`Error: ${res.status} - ${res.statusText}`);
    const text = await res.text();
    console.error(text);
    return;
  }
  const data = await res.json();
  console.log('Success! Tables:', data.tables.map(t => t.name));
}

// Node.js fetch polyfill
if (!globalThis.fetch) {
  globalThis.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

// Run the test

(async () => {
  await testAirtableAccess();
})();
