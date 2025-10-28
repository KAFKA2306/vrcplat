import Fastify from 'fastify';

const server = Fastify({
  logger: true
});

server.get('/', async () => ({ status: 'identity service coming soon' }));

export async function start() {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}
