import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';

const userIdHeaderSchema = z.string().uuid({ message: 'x-user-id header must be a UUID' });

export const USER_ID_HEADER = 'x-user-id';

export function resolveUserId(app: FastifyInstance, request: FastifyRequest): string {
  const raw = request.headers[USER_ID_HEADER];

  if (!raw || Array.isArray(raw)) {
    throw app.httpErrors.unauthorized('x-user-id header required');
  }

  return userIdHeaderSchema.parse(raw);
}
