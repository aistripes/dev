import { readFile, writeFile } from 'node:fs/promises';

const dimensions = 64;
const words = (text) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
const hash = (word) => {
  let value = 2166136261;
  for (const character of word) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return value >>> 0;
};

export function embed(text) {
  const vector = Array(dimensions).fill(0);
  for (const word of words(text)) vector[hash(word) % dimensions] += hash(word) & 1 ? 1 : -1;
  const norm = Math.hypot(...vector) || 1;
  return vector.map((value) => value / norm);
}

export function chunk(text, size = 45, overlap = 8) {
  const tokens = text.trim().split(/\s+/);
  const chunks = [];
  for (let start = 0; start < tokens.length; start += size - overlap) {
    const value = tokens.slice(start, start + size).join(' ');
    if (value) chunks.push(value);
    if (start + size >= tokens.length) break;
  }
  return chunks;
}

export function buildIndex(documents, now = new Date().toISOString()) {
  return documents.flatMap((document) => chunk(document.text).map((text, position) => ({
    id: `${document.id}:${position}`,
    documentId: document.id,
    tenantId: document.tenantId,
    allowedRoles: document.allowedRoles,
    sourceUpdatedAt: document.sourceUpdatedAt,
    expiresAt: document.expiresAt ?? null,
    deletedAt: null,
    indexedAt: now,
    text,
    embedding: embed(text),
  })));
}

const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
export function retrieve(index, { query, tenantId, roles, now = new Date().toISOString(), limit = 3 }) {
  if (!tenantId || !Array.isArray(roles)) throw new Error('tenantId and roles are required');
  const queryVector = embed(query);
  return index
    .filter((item) => item.tenantId === tenantId)
    .filter((item) => !item.deletedAt && (!item.expiresAt || item.expiresAt > now))
    .filter((item) => item.allowedRoles.some((role) => roles.includes(role)))
    .map((item) => ({ ...item, score: dot(queryVector, item.embedding) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function deleteDocument(index, { tenantId, documentId, deletedAt = new Date().toISOString() }) {
  return index.map((item) => item.tenantId === tenantId && item.documentId === documentId ? { ...item, deletedAt } : item);
}

async function main([command, ...args]) {
  if (command === 'build') {
    const fixture = JSON.parse(await readFile(args[0], 'utf8'));
    await writeFile(args[1], `${JSON.stringify(buildIndex(fixture.documents, fixture.now), null, 2)}\n`);
    console.log(`indexed ${fixture.documents.length} documents`);
  } else if (command === 'query') {
    const index = JSON.parse(await readFile(args[0], 'utf8'));
    console.log(JSON.stringify(retrieve(index, { query: args[1], tenantId: args[2], roles: args[3].split(',') }), null, 2));
  } else throw new Error('usage: pipeline.mjs build <fixture> <index> | query <index> <query> <tenant> <roles>');
}

if (process.argv[1] === new URL(import.meta.url).pathname) main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
