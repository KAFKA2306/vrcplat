import { consentStateSchema, userProfileSchema } from '@vrcplat/contracts';
import { z } from 'zod';

export const sessionSchema = z.object({
  user: userProfileSchema,
  consent: consentStateSchema.optional()
});

export type Session = z.infer<typeof sessionSchema>;
