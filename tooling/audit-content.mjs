import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../content/', import.meta.url);
const files = [];
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const section = entry.name;
  const directory = new URL(`${section}/`, root);
  for (const name of await readdir(directory)) {
    if (name.endsWith('.json')) files.push({ section, name, url: new URL(name, directory) });
  }
}

const records = await Promise.all(files.map(async (file) => ({
  ...file,
  data: JSON.parse(await readFile(file.url, 'utf8')),
})));
const findings = [];
const add = (severity, rule, record, detail) => findings.push({ severity, rule, file: `content/${record.section}/${record.name}`, detail });
const normalized = (value = '') => value.toLowerCase().replace(/\d{4}/g, '<year>').replace(/[^a-z0-9]+/g, ' ').trim();

const fields = new Map();
for (const record of records) {
  const { data } = record;
  const title = data.seo?.title ?? '';
  const description = data.seo?.description ?? '';
  const slug = data.seo?.slug ?? '';
  const intro = data.content?.intro ?? '';

  for (const [kind, value] of [['description', description], ['intro', intro]]) {
    const key = `${kind}:${normalized(value)}`;
    if (value && normalized(value).split(' ').length >= 8) fields.set(key, [...(fields.get(key) ?? []), record]);
  }
  if (title.length > 65) add('warning', 'long-title', record, `${title.length} characters`);
  if (description.length < 70) add('warning', 'short-description', record, `${description.length} characters`);
  if (/\b(?:and|with|for|to|vs|the|a|an|of|in)\s*$/i.test(title)) add('error', 'truncated-title', record, title);
  if (/(?:-|\b)(?:and|with|for|to|vs|the|a|an|of|in)$/i.test(slug)) add('error', 'truncated-slug', record, slug);
  if (/\blorem ipsum\b/i.test(JSON.stringify(data))) add('error', 'placeholder-content', record, 'Lorem ipsum detected');

  const text = JSON.stringify(data);
  const staleYears = new Set([...text.matchAll(/\b(20\d{2})\b/g)].map((match) => match[1]).filter((year) => Number(year) < new Date().getUTCFullYear() - 1));
  for (const year of staleYears) add('warning', 'stale-year', record, year);
  const entries = data.content?.entries;
  if (Array.isArray(entries)) {
    const claim = `${title} ${description} ${intro}`.match(/\b(\d{2,3})\+?\s+(?:best\s+)?(?:tools|resources|platforms|services|entries)\b/i);
    if (claim && Number(claim[1]) > entries.length) add('error', 'unsupported-count-claim', record, `claims ${claim[1]}, contains ${entries.length} entries`);
    const urls = new Set();
    for (const entry of entries) {
      if (entry.url && urls.has(entry.url)) add('error', 'duplicate-entry-url', record, entry.url);
      if (entry.url) urls.add(entry.url);
    }
  }
}

for (const [key, duplicates] of fields) {
  if (duplicates.length < 2) continue;
  const kind = key.slice(0, key.indexOf(':'));
  for (const record of duplicates) add('error', `duplicate-${kind}`, record, `shared by ${duplicates.length} pages`);
}

findings.sort((a, b) => a.severity.localeCompare(b.severity) || a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file));
const counts = findings.reduce((all, item) => ({ ...all, [item.severity]: (all[item.severity] ?? 0) + 1 }), {});
console.log(`Audited ${records.length} content files: ${counts.error ?? 0} errors, ${counts.warning ?? 0} warnings.`);
for (const item of findings) console.log(`${item.severity.toUpperCase()} ${item.rule} ${item.file}: ${item.detail}`);
if (process.argv.includes('--strict') && counts.error) process.exitCode = 1;
