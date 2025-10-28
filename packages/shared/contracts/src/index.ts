import { z } from 'zod';

export const consentScopeValues = [
  'presence:self',
  'presence:friends',
  'history:self',
  'purchases:self',
  'avatar:meta',
  'avatar:diff',
  'post:write',
  'event:write',
  'profile:pin'
] as const;

export const consentScopeSchema = z.enum(consentScopeValues);

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  handle: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_\-]+$/i, 'Handle must be alphanumeric with dashes/underscores'),
  displayName: z.string().min(1).max(64),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Locale must match IETF BCP 47 (e.g. ja, en-US)'),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const consentStateSchema = z.object({
  userId: z.string().uuid(),
  scopes: z.object({
    'presence:self': z.boolean(),
    'presence:friends': z.boolean(),
    'history:self': z.boolean(),
    'purchases:self': z.boolean(),
    'avatar:meta': z.boolean(),
    'avatar:diff': z.boolean(),
    'post:write': z.boolean(),
    'event:write': z.boolean(),
    'profile:pin': z.boolean()
  }),
  updatedAt: z.string().datetime()
});

export const presenceSourceSchema = z.enum(['beacon', 'import']);

export const presenceVisibilitySchema = z.enum(['private', 'friends', 'consented']);

export const presenceSessionSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    worldId: z.string().min(1),
    instanceId: z.string().min(1),
    enteredAt: z.string().datetime(),
    leftAt: z.string().datetime().optional(),
    source: presenceSourceSchema,
    visibility: presenceVisibilitySchema.default('private'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .superRefine((value, ctx) => {
    if (value.leftAt) {
      const entered = Date.parse(value.enteredAt);
      const left = Date.parse(value.leftAt);
      if (Number.isNaN(entered) || Number.isNaN(left) || left <= entered) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['leftAt'],
          message: 'leftAt must be later than enteredAt'
        });
      }
    }
  });

export const purchaseProviderSchema = z.enum(['booth', 'shopify', 'gumroad', 'patreon', 'fanbox', 'email', 'manual']);

export const purchaseStatusSchema = z.enum(['completed', 'refunded', 'pending']);

export const purchaseRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  provider: purchaseProviderSchema,
  itemId: z.string().min(1),
  itemType: z.enum(['avatar', 'outfit', 'asset', 'subscription', 'donation', 'other']).default('other'),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.object({
    amount: z.number().nonnegative().finite(),
    currency: z.string().regex(/^[A-Z]{3}$/, 'Use ISO 4217 currency code')
  }),
  purchasedAt: z.string().datetime(),
  receiptRef: z.string().max(120).optional(),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
  linkedAvatarVersionId: z.string().uuid().optional(),
  status: purchaseStatusSchema.default('completed'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  metadata: z.record(z.string(), z.string()).optional()
});

export const exportBundleStatusSchema = z.enum(['queued', 'processing', 'ready', 'failed']);

export const exportBundleRequestSchema = z
  .object({
    userId: z.string().uuid(),
    requestedAt: z.string().datetime(),
    status: exportBundleStatusSchema,
    downloadUrl: z.string().url().optional(),
    expiresAt: z.string().datetime().optional(),
    checksum: z.string().length(64).optional()
  })
  .superRefine((value, ctx) => {
    if (value.status === 'ready') {
      if (!value.downloadUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['downloadUrl'],
          message: 'downloadUrl is required when status is ready'
        });
      }
      if (!value.expiresAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expiresAt'],
          message: 'expiresAt is required when status is ready'
        });
      }
    }
  });

export type ConsentScope = z.infer<typeof consentScopeSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type ConsentState = z.infer<typeof consentStateSchema>;
export type PresenceSession = z.infer<typeof presenceSessionSchema>;
export type PurchaseRecord = z.infer<typeof purchaseRecordSchema>;
export type ExportBundleRequest = z.infer<typeof exportBundleRequestSchema>;

export const contractSchemas = {
  userProfile: userProfileSchema,
  consentState: consentStateSchema,
  presenceSession: presenceSessionSchema,
  purchaseRecord: purchaseRecordSchema,
  exportBundleRequest: exportBundleRequestSchema
};
