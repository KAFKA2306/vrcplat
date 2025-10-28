import { buildServer } from './app';

async function start() {
  const app = await buildServer();

  try {
    await app.listen({
      port: Number.parseInt(process.env.PORT ?? '3001', 10),
      host: '0.0.0.0'
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { buildServer };
