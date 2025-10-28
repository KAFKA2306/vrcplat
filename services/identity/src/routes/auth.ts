import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { IdentityStore } from '../store/identity-store';

const linkRequestSchema = z.object({
  provider: z.enum(['discord', 'google', 'x', 'youtube']),
  code: z.string().min(6).max(255),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Locale must match IETF BCP 47').optional(),
  displayName: z.string().min(1).max(64).optional()
});

type LinkRequest = z.infer<typeof linkRequestSchema>;

export function registerAuthRoutes(app: FastifyInstance, store: IdentityStore) {
  app.post<{ Body: LinkRequest }>('/auth/link', async (request, reply) => {
    const body = linkRequestSchema.parse(request.body);
    const result = store.linkExternalAccount({
      provider: body.provider,
      accountRef: body.code,
      locale: body.locale,
      displayName: body.displayName
    });

    return reply.code(201).send({
      user: result.profile,
      consent: result.consent,
      externalAccount: {
        id: result.externalAccountId,
        provider: body.provider
      }
    });
  });
}
