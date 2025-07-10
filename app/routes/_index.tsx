import { redirect } from '@remix-run/node';
import { hasUserRegistered } from '~/~models/user.server';

export async function loader() {
  const userRegistered = await hasUserRegistered();

  if (userRegistered) return redirect('/dashboard/login');
  return redirect('/dashboard/register');
}
