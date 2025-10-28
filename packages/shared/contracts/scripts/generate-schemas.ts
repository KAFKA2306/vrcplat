import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  consentStateSchema,
  exportBundleRequestSchema,
  purchaseRecordSchema,
  presenceSessionSchema,
  userProfileSchema
} from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, '..', 'tests', 'contracts');

mkdirSync(outputDir, { recursive: true });

const schemas = [
  ['user-profile', userProfileSchema],
  ['consent-state', consentStateSchema],
  ['presence-session', presenceSessionSchema],
  ['purchase-record', purchaseRecordSchema],
  ['export-bundle-request', exportBundleRequestSchema]
] as const;

for (const [name, schema] of schemas) {
  const jsonSchema = zodToJsonSchema(schema, name, {
    target: 'jsonSchema7'
  });

  writeFileSync(join(outputDir, `${name}.schema.json`), `${JSON.stringify(jsonSchema, null, 2)}\n`);
}
