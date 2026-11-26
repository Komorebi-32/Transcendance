import { z } from 'zod';

/**
 * GET /api/health — liveness check used by Docker, CI and the web app.
 * Owner: A (platform). This is also the reference example of a contract:
 * one Zod schema, one inferred type, used by both the API and the web app.
 */
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
  version: z.string(),
  time: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
