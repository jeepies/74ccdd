import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { hasUserRegistered } from '~/~models/user.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const userRegistered = await hasUserRegistered();

  if (userRegistered) return redirect('/dashboard/login');
  return redirect('/dashboard/register');
}
