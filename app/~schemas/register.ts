import z from 'zod';
import { currencies } from '~/~types/Currency';
import { timeZones } from '~/~types/Timezone';

const currencyEnum = z.enum(Object.keys(currencies) as [keyof typeof currencies, ...Array<keyof typeof currencies>]);
const timezoneEnum = z.enum(Object.keys(timeZones) as [keyof typeof timeZones, ...Array<keyof typeof timeZones>]);

export const registerSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
    currency: currencyEnum,
    timezone: timezoneEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
