# Minimal tenant-safe RAG retrieval reference

This zero-dependency Node.js implementation demonstrates ingestion, deterministic local embeddings, retrieval-time tenant/RBAC filtering, expiry, and tombstone deletion. The hash embedding is deliberately pedagogical: replace it with a real embedding model before production. It is not a quality or performance benchmark.

```bash
node examples/rag-pipeline/test.mjs
node examples/rag-pipeline/pipeline.mjs build examples/rag-pipeline/fixture.json /tmp/rag-index.json
node examples/rag-pipeline/pipeline.mjs query /tmp/rag-index.json "refund window" acme support
```
