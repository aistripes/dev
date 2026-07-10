import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NicheDefinitionSchema, type NicheDefinition } from '../../taxonomy/_schema';

const taxonomyRoot = join(process.cwd(), 'taxonomy');

export function getAllNiches(): NicheDefinition[] {
  return readdirSync(taxonomyRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((category) =>
      readdirSync(join(taxonomyRoot, category.name))
        .filter((file) => file.endsWith('.json'))
        .map((file) => {
          const raw = JSON.parse(readFileSync(join(taxonomyRoot, category.name, file), 'utf8'));
          return NicheDefinitionSchema.parse(raw);
        }),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}
