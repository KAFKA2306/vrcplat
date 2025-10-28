import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  consentScopeSchema,
  consentScopeValues,
  consentStateSchema,
  exportBundleRequestSchema,
  presenceSessionSchema,
  purchaseRecordSchema,
  userProfileSchema
} from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaDir = join(__dirname, 'contracts');

const loadSnapshot = (name: string) => {
  const file = join(schemaDir, `${name}.schema.json`);
  return JSON.parse(readFileSync(file, 'utf-8'));
};

describe('contract schemas', () => {
  it('validates sample user profile payloads', () => {
    const payload = {
      id: '5ea1f7f4-4d41-4451-9fe5-87c4bb1efc20',
      handle: 'kafka_creator',
      displayName: 'Kafka Creator',
      locale: 'ja',
      avatarUrl: 'https://cdn.example.com/avatar.png',
      createdAt: '2025-10-27T18:04:12.000Z',
      updatedAt: '2025-10-27T18:04:12.000Z'
    };

    expect(userProfileSchema.parse(payload)).toEqual(payload);
  });

  it('enforces consent scope completeness', () => {
    const result = consentStateSchema.safeParse({
      userId: '5ea1f7f4-4d41-4451-9fe5-87c4bb1efc20',
      scopes: {
        'presence:self': true,
        'presence:friends': false,
        'history:self': true,
        'purchases:self': false,
        'avatar:meta': true,
        'avatar:diff': false,
        'post:write': true,
        'event:write': false,
        'profile:pin': true
      },
      updatedAt: '2025-10-27T18:04:12.000Z'
    });

    expect(result.success).toBe(true);
  });

  it('rejects presence sessions where leftAt precedes enteredAt', () => {
    const result = presenceSessionSchema.safeParse({
      id: 'ef85a399-c654-41e9-bbe5-499a8ba1b2d6',
      userId: '5ea1f7f4-4d41-4451-9fe5-87c4bb1efc20',
      worldId: 'wrld_123',
      instanceId: 'wrld_123:instance',
      enteredAt: '2025-10-27T18:04:12.000Z',
      leftAt: '2025-10-27T17:04:12.000Z',
      source: 'beacon',
      visibility: 'private',
      createdAt: '2025-10-27T18:04:12.000Z',
      updatedAt: '2025-10-27T18:04:12.000Z'
    });

    expect(result.success).toBe(false);
  });

  it('requires download metadata when export is ready', () => {
    const result = exportBundleRequestSchema.safeParse({
      userId: '5ea1f7f4-4d41-4451-9fe5-87c4bb1efc20',
      requestedAt: '2025-10-27T18:04:12.000Z',
      status: 'ready'
    });

    expect(result.success).toBe(false);
  });

  it('defaults export format to json', () => {
    const payload = exportBundleRequestSchema.parse({
      userId: '5ea1f7f4-4d41-4451-9fe5-87c4bb1efc20',
      requestedAt: '2025-10-27T18:04:12.000Z',
      status: 'queued'
    });

    expect(payload.format).toBe('json');
  });

  it('matches stored JSON schema snapshots', () => {
    const expected = {
      'user-profile': loadSnapshot('user-profile'),
      'consent-state': loadSnapshot('consent-state'),
      'presence-session': loadSnapshot('presence-session'),
      'purchase-record': loadSnapshot('purchase-record'),
      'export-bundle-request': loadSnapshot('export-bundle-request')
    };

    expect(zodToJsonSchema(userProfileSchema, 'user-profile', { target: 'jsonSchema7' })).toEqual(
      expected['user-profile']
    );
    expect(zodToJsonSchema(consentStateSchema, 'consent-state', { target: 'jsonSchema7' })).toEqual(
      expected['consent-state']
    );
    expect(zodToJsonSchema(presenceSessionSchema, 'presence-session', { target: 'jsonSchema7' })).toEqual(
      expected['presence-session']
    );
    expect(zodToJsonSchema(purchaseRecordSchema, 'purchase-record', { target: 'jsonSchema7' })).toEqual(
      expected['purchase-record']
    );
    expect(zodToJsonSchema(exportBundleRequestSchema, 'export-bundle-request', { target: 'jsonSchema7' })).toEqual(
      expected['export-bundle-request']
    );
  });

  it('exposes consent scope enumeration', () => {
    expect(consentScopeSchema.options).toEqual(consentScopeValues);
  });
});
