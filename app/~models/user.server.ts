import { prisma } from '~/~services/database.server';
import bcrypt from 'bcrypt';

/**
 * Check if a user has been registered
 * @returns boolean
 */
export async function hasUserRegistered(): Promise<boolean> {
  const count = await prisma.user.count();
  return count === 1;
}

/**
 * Get the username
 * @returns Username, or undefined if user doesn't exist
 */
export async function getUsername(): Promise<string | undefined> {
  if (!hasUserRegistered) return undefined;
  const user = await prisma.user.findFirst();
  return user?.username ? user.username : undefined;
}

/**
 * Create the user
 * @param User
 * @returns
 */
export async function createUser({
  username,
  password,
  currency,
  timezone,
}: {
  username: string;
  password: string;
  currency: 'GBP' | 'USD' | 'EUR';
  timezone: 'GMT' | 'EST' | 'PST' | 'CET';
}) {
  const registered = await hasUserRegistered();
  if (registered) return;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      preferences: {
        create: {
          currency,
          timezone,
        },
      },
    },
    include: {
      preferences: true,
    },
  });

  return user;
}
