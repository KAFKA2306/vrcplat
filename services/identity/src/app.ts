import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import sensible from '@fastify/sensible';
import { IdentityStore } from './store/identity-store';
import { registerAuthRoutes } from './routes/auth';
import { registerConsentRoutes } from './routes/consent';
import { registerDataRoutes } from './routes/data';

export interface BuildServerOptions {
  logger?: FastifyServerOptions['logger'];
  store?: IdentityStore;
}

export async function buildServer(options: BuildServerOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? true
  });

  await app.register(sensible);

  const store = options.store ?? new IdentityStore();

  registerAuthRoutes(app, store);
  registerConsentRoutes(app, store);
  registerDataRoutes(app, store);

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
