import { prisma } from '~/~services/database.server';

/**
 * Check if a user has been registered
 * @returns boolean
 */
export async function hasUserRegistered(): Promise<boolean> {
  const count = await prisma.user.count();
  return count === 1;
}
