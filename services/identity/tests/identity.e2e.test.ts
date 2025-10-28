import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildServer } from '../src/app';
import { IdentityStore } from '../src/store/identity-store';

const providerPayload = {
  provider: 'discord',
  code: 'valid-code-123'
} as const;

describe('identity service', () => {
  let app: FastifyInstance;
  let store: IdentityStore;

  beforeEach(async () => {
    store = new IdentityStore();
    app = await buildServer({ logger: false, store });
  });

  afterEach(async () => {
    await app.close();
  });

  it('links external accounts and returns default consent state', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/link',
      payload: { ...providerPayload, locale: 'ja', displayName: 'Kafka Creator' }
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.user.id).toMatch(/[0-9a-f-]{36}/);
    expect(body.consent.scopes['presence:self']).toBe(false);
    expect(body.user.locale).toBe('ja');
  });

  it('requires auth context for consent operations', async () => {
    const response = await app.inject({ method: 'GET', url: '/privacy/consent' });
    expect(response.statusCode).toBe(401);
  });

  it('allows reading and updating consent scopes', async () => {
    const linkResponse = await app.inject({
      method: 'POST',
      url: '/auth/link',
      payload: providerPayload
    });
    const { user } = linkResponse.json();

    const getResponse = await app.inject({
      method: 'GET',
      url: '/privacy/consent',
      headers: { 'x-user-id': user.id }
    });
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json().consent.scopes['post:write']).toBe(false);

    const patchResponse = await app.inject({
      method: 'PATCH',
      url: '/privacy/consent',
      headers: { 'x-user-id': user.id },
      payload: {
        scopes: {
          'presence:self': true,
          'post:write': true
        }
      }
    });

    expect(patchResponse.statusCode).toBe(200);
    expect(patchResponse.json().consent.scopes).toMatchObject({
      'presence:self': true,
      'post:write': true
    });
  });

  it('enqueues export and delete jobs', async () => {
    const linkResponse = await app.inject({
      method: 'POST',
      url: '/auth/link',
      payload: providerPayload
    });
    const { user } = linkResponse.json();

    const exportResponse = await app.inject({
      method: 'POST',
      url: '/data/export',
      headers: { 'x-user-id': user.id },
      payload: { format: 'csv' }
    });

    expect(exportResponse.statusCode).toBe(202);
    expect(exportResponse.json().job).toMatchObject({ status: 'queued', format: 'csv' });

    const deleteResponse = await app.inject({
      method: 'POST',
      url: '/data/delete',
      headers: { 'x-user-id': user.id },
      payload: { reason: 'user-request' }
    });

    expect(deleteResponse.statusCode).toBe(202);
    expect(deleteResponse.json().job.reason).toBe('user-request');
  });

  it('returns existing profile when relinking the same external account', async () => {
    const first = await app.inject({ method: 'POST', url: '/auth/link', payload: providerPayload });
    const second = await app.inject({ method: 'POST', url: '/auth/link', payload: providerPayload });

    expect(second.statusCode).toBe(201);
    expect(second.json().user.id).toBe(first.json().user.id);
  });
});
