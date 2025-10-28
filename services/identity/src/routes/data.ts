import { FastifyInstance } from 'fastify';
import { exportBundleFormatSchema } from '@vrcplat/contracts';
import { z } from 'zod';
import { IdentityStore } from '../store/identity-store';
import { resolveUserId } from '../utils/request-context';

const exportRequestSchema = z.object({
  format: exportBundleFormatSchema.optional()
});

const deleteRequestSchema = z.object({
  reason: z.string().max(240).optional()
});

type ExportRequest = z.infer<typeof exportRequestSchema>;
type DeleteRequest = z.infer<typeof deleteRequestSchema>;

export function registerDataRoutes(app: FastifyInstance, store: IdentityStore) {
  app.post<{ Body: ExportRequest }>('/data/export', async (request, reply) => {
    const userId = resolveUserId(app, request);
    const body = exportRequestSchema.parse(request.body ?? {});
    const format = body.format ?? 'json';

    const { jobId, job } = store.enqueueExport(userId, format);

    return reply.code(202).send({
      job: {
        id: jobId,
        status: job.status,
        requestedAt: job.requestedAt,
        format: job.format,
        downloadUrl: job.downloadUrl ?? null,
        expiresAt: job.expiresAt ?? null
      }
    });
  });

  app.post<{ Body: DeleteRequest }>('/data/delete', async (request, reply) => {
    const userId = resolveUserId(app, request);
    const body = deleteRequestSchema.parse(request.body ?? {});
    const job = store.enqueueDelete(userId);

    return reply.code(202).send({
      job: {
        id: job.jobId,
        status: job.status,
        requestedAt: job.requestedAt,
        reason: body.reason ?? null
      }
    });
  });
}
