import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildIndex, deleteDocument, retrieve } from './pipeline.mjs';

const fixture = JSON.parse(await readFile(new URL('./fixture.json', import.meta.url), 'utf8'));
const index = buildIndex(fixture.documents, fixture.now);
for (const test of fixture.cases) {
  const results = retrieve(index, { ...test, now: fixture.now, limit: 10 });
  const ids = new Set(results.map((result) => result.documentId));
  for (const id of test.expectedDocumentIds ?? []) assert(ids.has(id), `${test.name}: expected ${id}`);
  for (const id of test.forbiddenDocumentIds ?? []) assert(!ids.has(id), `${test.name}: leaked ${id}`);
}
const deleted = deleteDocument(index, { tenantId: 'acme', documentId: 'refunds', deletedAt: fixture.now });
assert(!retrieve(deleted, { query: 'refund', tenantId: 'acme', roles: ['support'], now: fixture.now }).some((item) => item.documentId === 'refunds'));
assert.throws(() => retrieve(index, { query: 'refund', roles: ['support'] }), /tenantId/);
console.log(`PASS ${fixture.cases.length + 2} deterministic retrieval, isolation, freshness, deletion, and input checks`);
