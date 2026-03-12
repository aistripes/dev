import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ResourceArticleSchema } from '../../schemas/resource-article';
import { ChecklistSchema } from '../../schemas/checklist';
import { ComparisonSchema } from '../../schemas/comparison';
import { GuideSchema } from '../../schemas/guide';
import { ToolPageSchema } from '../../schemas/tool-page';
import { DirectorySchema } from '../../schemas/directory';
import type { ResourceArticle } from '../../schemas/resource-article';
import type { Checklist } from '../../schemas/checklist';
import type { Comparison } from '../../schemas/comparison';
import type { Guide } from '../../schemas/guide';
import type { ToolPage } from '../../schemas/tool-page';
import type { Directory } from '../../schemas/directory';

export type ContentType =
  | 'resource-article'
  | 'checklist'
  | 'comparison'
  | 'guide'
  | 'tool-page'
  | 'directory';

export type AnyContent = ResourceArticle | Checklist | Comparison | Guide | ToolPage | Directory;

const contentTypeToDir: Record<ContentType, string> = {
  'resource-article': 'resources',
  checklist: 'checklists',
  comparison: 'comparisons',
  guide: 'guides',
  'tool-page': 'tools',
  directory: 'directories',
};

const schemas = {
  'resource-article': ResourceArticleSchema,
  checklist: ChecklistSchema,
  comparison: ComparisonSchema,
  guide: GuideSchema,
  'tool-page': ToolPageSchema,
  directory: DirectorySchema,
};

const contentRoot = join(process.cwd(), 'content');

function readContentDir(dirName: string): Array<{ file: string; raw: unknown }> {
  const dirPath = join(contentRoot, dirName);
  let files: string[];
  try {
    files = readdirSync(dirPath).filter((f: string) => f.endsWith('.json'));
  } catch {
    return [];
  }
  return files.map((file) => {
    const raw = JSON.parse(readFileSync(join(dirPath, file), 'utf-8')) as unknown;
    return { file, raw };
  });
}

export function getAllContent(): Array<AnyContent> {
  const result: AnyContent[] = [];
  for (const [type, dir] of Object.entries(contentTypeToDir) as [ContentType, string][]) {
    const schema = schemas[type];
    for (const { file, raw } of readContentDir(dir)) {
      const parsed = schema.safeParse(raw);
      if (parsed.success) {
        result.push(parsed.data as AnyContent);
      } else {
        console.warn(`[content] Validation failed for ${dir}/${file}:`, parsed.error.message);
      }
    }
  }
  return result;
}

export type ContentWithPath = {
  content: AnyContent;
  urlPrefix: string;
  slug: string;
};

const urlPrefixes: Record<ContentType, string> = {
  'resource-article': 'resources',
  checklist: 'checklists',
  comparison: 'comparisons',
  guide: 'guides',
  'tool-page': 'tools',
  directory: 'directories',
};

export function getAllContentWithPaths(): ContentWithPath[] {
  const result: ContentWithPath[] = [];
  for (const [type, dir] of Object.entries(contentTypeToDir) as [ContentType, string][]) {
    const schema = schemas[type];
    for (const { raw } of readContentDir(dir)) {
      const parsed = schema.safeParse(raw);
      if (parsed.success) {
        const content = parsed.data as AnyContent;
        result.push({
          content,
          urlPrefix: urlPrefixes[type],
          slug: content.seo.slug,
        });
      }
    }
  }
  return result;
}
