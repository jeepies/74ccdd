import { createCookie, redirect } from '@remix-run/node';
import { hasUserRegistered } from '~/~models/user.server';
import { prisma } from './database.server';
import config from './config.server';

export async function redirectIfUserHasRegistered() {
  const alreadyRegistered = await hasUserRegistered();
  if (alreadyRegistered) {
    throw redirect('/dashboard/login');
  }
}

const authToken = createCookie(config.AUTH.COOKIE_NAME, {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secrets: config.AUTH.SECRETS,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
});

export async function getUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const token = await authToken.parse(cookieHeader);
  if (!token || typeof token !== 'string') return null;
  return prisma.user.findUnique({ where: { id: token } });
}

export async function loginUser(userId: string) {
  const cookie = await authToken.serialize(userId);
  return redirect('/dashboard/index', {
    headers: { 'Set-Cookie': cookie },
  });
}

export async function logoutUser() {
  return redirect('/dashboard/login', {
    headers: { 'Set-Cookie': await authToken.serialize('', { maxAge: 0 }) },
  });
}
