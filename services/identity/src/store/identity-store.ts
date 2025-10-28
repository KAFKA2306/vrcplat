import { randomUUID } from 'node:crypto';
import {
  ConsentScope,
  ConsentState,
  ExportBundleFormat,
  ExportBundleRequest,
  UserProfile,
  consentScopeValues,
  consentStateSchema,
  exportBundleRequestSchema,
  userProfileSchema
} from '@vrcplat/contracts';
import { z } from 'zod';

const linkExternalAccountInputSchema = z.object({
  provider: z.enum(['discord', 'google', 'x', 'youtube']),
  accountRef: z.string().min(1).max(255),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Locale must match IETF BCP 47').optional(),
  displayName: z.string().min(1).max(64).optional()
});

type LinkExternalAccountInput = z.infer<typeof linkExternalAccountInputSchema>;

type DeleteJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface DeleteJob {
  jobId: string;
  userId: string;
  requestedAt: string;
  status: DeleteJobStatus;
}

interface ExternalAccountRecord {
  id: string;
  provider: LinkExternalAccountInput['provider'];
  accountRef: string;
  linkedAt: string;
}

interface UserRecord {
  profile: UserProfile;
  consent: ConsentState;
  externalAccounts: ExternalAccountRecord[];
  exportJobs: Map<string, ExportBundleRequest>;
  deleteJobs: Map<string, DeleteJob>;
}

export interface LinkExternalAccountResult {
  userId: string;
  externalAccountId: string;
  profile: UserProfile;
  consent: ConsentState;
}

const defaultScopes = consentScopeValues.reduce<Record<ConsentScope, boolean>>((acc, scope) => {
  acc[scope] = false;
  return acc;
}, {} as Record<ConsentScope, boolean>);

const sanitizeHandle = (provider: string, accountRef: string) => {
  const base = `${provider}-${accountRef}`.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fallback = `${provider}-${randomUUID().slice(0, 8)}`;
  const trimmed = base.length >= 3 ? base.slice(0, 32) : fallback.slice(0, 32);
  return trimmed;
};

export class IdentityStore {
  private readonly users = new Map<string, UserRecord>();
  private readonly externalAccountIndex = new Map<string, { userId: string; externalAccountId: string }>();

  linkExternalAccount(input: LinkExternalAccountInput): LinkExternalAccountResult {
    const parsed = linkExternalAccountInputSchema.parse(input);
    const key = `${parsed.provider}:${parsed.accountRef}`;
    const existing = this.externalAccountIndex.get(key);

    if (existing) {
      const record = this.users.get(existing.userId);
      if (!record) {
        throw new Error(`Invariant violated: user missing for external account ${key}`);
      }
      const account = record.externalAccounts.find((acc) => acc.id === existing.externalAccountId);
      if (!account) {
        throw new Error(`Invariant violated: external account record missing for ${key}`);
      }

      return {
        userId: existing.userId,
        externalAccountId: account.id,
        profile: record.profile,
        consent: record.consent
      };
    }

    const now = new Date().toISOString();
    const userId = randomUUID();
    const externalAccountId = randomUUID();
    const handle = sanitizeHandle(parsed.provider, parsed.accountRef);
    const profile = userProfileSchema.parse({
      id: userId,
      handle,
      displayName: parsed.displayName ?? handle,
      locale: parsed.locale ?? 'en-US',
      avatarUrl: undefined,
      createdAt: now,
      updatedAt: now
    });

    const consent = consentStateSchema.parse({
      userId,
      scopes: { ...defaultScopes },
      updatedAt: now
    });

    const record: UserRecord = {
      profile,
      consent,
      externalAccounts: [
        {
          id: externalAccountId,
          provider: parsed.provider,
          accountRef: parsed.accountRef,
          linkedAt: now
        }
      ],
      exportJobs: new Map(),
      deleteJobs: new Map()
    };

    this.users.set(userId, record);
    this.externalAccountIndex.set(key, { userId, externalAccountId });

    return {
      userId,
      externalAccountId,
      profile,
      consent
    };
  }

  getConsentState(userId: string): ConsentState | undefined {
    return this.users.get(userId)?.consent;
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.users.get(userId)?.profile;
  }

  updateConsent(userId: string, updates: Partial<Record<ConsentScope, boolean>>): ConsentState {
    const record = this.users.get(userId);
    if (!record) {
      throw new Error('User not found');
    }

    const nextScopes = { ...record.consent.scopes };
    for (const [key, value] of Object.entries(updates) as Array<[ConsentScope, boolean]>) {
      if (!consentScopeValues.includes(key)) {
        throw new Error(`Unsupported consent scope: ${key}`);
      }
      nextScopes[key] = value;
    }

    const updatedAt = new Date().toISOString();
    const nextConsent = consentStateSchema.parse({
      userId,
      scopes: nextScopes,
      updatedAt
    });

    record.consent = nextConsent;
    return nextConsent;
  }

  enqueueExport(userId: string, format: ExportBundleFormat = 'json'): { jobId: string; job: ExportBundleRequest } {
    const record = this.users.get(userId);
    if (!record) {
      throw new Error('User not found');
    }

    const jobId = randomUUID();
    const requestedAt = new Date().toISOString();
    const job = exportBundleRequestSchema.parse({
      userId,
      requestedAt,
      status: 'queued',
      format
    });

    record.exportJobs.set(jobId, job);
    return { jobId, job };
  }

  enqueueDelete(userId: string): DeleteJob {
    const record = this.users.get(userId);
    if (!record) {
      throw new Error('User not found');
    }

    const jobId = randomUUID();
    const requestedAt = new Date().toISOString();
    const job: DeleteJob = {
      jobId,
      userId,
      requestedAt,
      status: 'queued'
    };

    record.deleteJobs.set(jobId, job);
    return job;
  }
}
