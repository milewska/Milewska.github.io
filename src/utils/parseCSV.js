import Papa from 'papaparse';

export default function parseCSV(text) {
  const { data, errors, meta } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) {
    throw new Error('CSV parsing error');
  }

  const required = ['Phase Name', 'Start Date', 'End Date'];
  const missing = required.filter((h) => !meta.fields.includes(h));
  if (missing.length) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}`);
  }

  return data.map((row) => ({
    ...row,
    name: row['Phase Name'],
    start: new Date(row['Start Date']),
    end: new Date(row['End Date']),
    strand: row['Strand'] || 'General',
  }));
}
