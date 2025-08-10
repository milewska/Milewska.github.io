const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listTables() {
  if (!API_KEY || !BASE_ID) {
    throw new Error('Missing Airtable credentials');
  }
  const data = await fetchJSON(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`);
  return data.tables.map((t) => t.name);
}

export async function fetchTableRecords(table) {
  if (!API_KEY || !BASE_ID) {
    throw new Error('Missing Airtable credentials');
  }
  const all = [];
  let offset;
  do {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}${offset ? `?offset=${offset}` : ''}`;
    const data = await fetchJSON(url);
    all.push(...data.records);
    offset = data.offset;
  } while (offset);

  return all.map((r) => {
    const fieldEntries = Object.entries(r.fields);
    const [firstColName, firstColValue] = fieldEntries[0] || ["", ""];
    return {
      ...r.fields,
      title: `${firstColName}: ${firstColValue}`,
      start: new Date(r.fields['Start Date']),
      end: new Date(r.fields['End Date']),
      strand: r.fields['Strand'] || 'General',
    };
  });
}
