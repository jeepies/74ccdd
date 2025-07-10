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
