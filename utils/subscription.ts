/**
 * Subscription utilities for checking user access and enforcing limits
 */

import { prisma } from './db';

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      account: {
        include: {
          subscriptions: {
            where: {
              status: { in: ['active', 'trialing'] },
            },
            take: 1,
          },
        },
      },
    },
  });

  return !!(user?.account?.subscriptions && user.account.subscriptions.length > 0);
}

/**
 * Get subscription details for a user
 */
export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      account: {
        include: {
          subscriptions: {
            where: {
              status: { in: ['active', 'trialing', 'past_due'] },
            },
            orderBy: {
              startedAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!user?.account?.subscriptions || user.account.subscriptions.length === 0) {
    return null;
  }

  return user.account.subscriptions[0];
}

/**
 * Check if user is within their usage limits based on their subscription tier
 * Returns { allowed: boolean, limit: number, current: number, message?: string }
 */
export async function checkUsageLimit(
  userId: string,
  limitType: 'projects' | 'documents' | 'claims'
): Promise<{ allowed: boolean; limit: number; current: number; message?: string }> {
  const subscription = await getUserSubscription(userId);

  // Define limits per tier
  const limits = {
    free: {
      projects: 1,
      documents: 5,
      claims: 50,
    },
    starter: {
      projects: 5,
      documents: 50,
      claims: 500,
    },
    professional: {
      projects: -1, // unlimited
      documents: -1,
      claims: -1,
    },
    enterprise: {
      projects: -1,
      documents: -1,
      claims: -1,
    },
  };

  // Determine tier from subscription (you may need to adjust this based on your price IDs)
  let tier: keyof typeof limits = 'free';
  if (subscription) {
    // This is a simplified example - you'd map price IDs to tiers
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      tier = 'professional'; // Default to professional for now
      // TODO: Map priceId to actual tier
    }
  }

  const limit = limits[tier][limitType];

  // If limit is -1, it's unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, current: 0 };
  }

  // Get current usage
  let current = 0;
  switch (limitType) {
    case 'projects':
      current = await prisma.project.count({ where: { userId } });
      break;
    case 'documents':
      current = await prisma.document.count({
        where: { project: { userId } },
      });
      break;
    case 'claims':
      current = await prisma.claim.count({
        where: { project: { userId } },
      });
      break;
  }

  const allowed = current < limit;
  const message = allowed
    ? undefined
    : `You've reached your ${limitType} limit (${limit}). Upgrade your plan to continue.`;

  return { allowed, limit, current, message };
}

/**
 * Middleware helper to require active subscription
 * Throws an error if user doesn't have an active subscription
 */
export async function requireActiveSubscription(userId: string): Promise<void> {
  const hasSubscription = await hasActiveSubscription(userId);
  
  if (!hasSubscription) {
    throw new Error('Active subscription required. Please upgrade your plan to continue.');
  }
}
