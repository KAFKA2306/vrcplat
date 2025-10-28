import { FastifyInstance } from 'fastify';
import { ConsentScope, consentScopeValues, consentStateSchema } from '@vrcplat/contracts';
import { z } from 'zod';
import { IdentityStore } from '../store/identity-store';
import { resolveUserId } from '../utils/request-context';

const consentUpdateSchema = z
  .object({
    scopes: z
      .record(z.boolean())
      .refine((value) => Object.keys(value).length > 0, { message: 'Provide at least one scope toggle' })
  })
  .superRefine((value, ctx) => {
    for (const key of Object.keys(value.scopes)) {
      if (!consentScopeValues.includes(key as typeof consentScopeValues[number])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scopes', key],
          message: `Unsupported consent scope: ${key}`
        });
      }
    }
  });

type ConsentUpdateRequest = z.infer<typeof consentUpdateSchema>;

export function registerConsentRoutes(app: FastifyInstance, store: IdentityStore) {
  app.get('/privacy/consent', async (request) => {
    const userId = resolveUserId(app, request);
    const consent = store.getConsentState(userId);
    if (!consent) {
      throw app.httpErrors.notFound('User not found');
    }

    return { consent: consentStateSchema.parse(consent) };
  });

  app.patch<{ Body: ConsentUpdateRequest }>('/privacy/consent', async (request) => {
    const userId = resolveUserId(app, request);
    const body = consentUpdateSchema.parse(request.body);

    const updates = Object.entries(body.scopes).reduce<Partial<Record<ConsentScope, boolean>>>(
      (acc, [scope, granted]) => {
        acc[scope as ConsentScope] = granted;
        return acc;
      },
      {}
    );

    const updated = store.updateConsent(userId, updates);
    return { consent: updated };
  });
}
