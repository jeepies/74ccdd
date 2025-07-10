import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, DollarSign, PartyPopper, User } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { CurrencyCode, currencies } from '~/~types/Currency';
import { TimeZoneCode, timeZones } from '~/~types/Timezone';
import { useToast } from '~/~hooks/use-toast';
import { registerSchema } from '~/~schemas/register';
import { createUser } from '~/~models/user.server';
import { ActionFunctionArgs } from '@remix-run/node';
import { redirectIfUserHasRegistered } from '~/~services/auth.server';

const steps: Record<number, string> = {
  1: 'Account Info',
  2: 'Preferences',
  3: 'Confirmation',
};

const icons: Record<number, JSX.Element> = {
  1: <User className="h-6 w-6" />,
  2: <DollarSign className="h-6 w-6" />,
  3: <PartyPopper className="h-6 w-6" />,
};

export async function loader() {
  await redirectIfUserHasRegistered();
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    username: formData.get('username')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    confirmPassword: formData.get('confirmPassword')?.toString() || '',
    currency: formData.get('currency')?.toString() || '',
    timezone: formData.get('timezone')?.toString() || '',
  };

  const result = registerSchema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      errors[issue.path[0] as string] = issue.message;
    }
    console.log(errors);
    return { success: false, errors };
  }

  const { username, password, currency, timezone } = result.data;

  try {
    await createUser({ username, password, currency, timezone });
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: {
        username: 'Username already exists or failed to create account.',
      },
    };
  }
}

export default function Register() {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    confirmPassword: string;
    currency: CurrencyCode | '';
    timezone: TimeZoneCode | '';
  }>({
    username: '',
    password: '',
    confirmPassword: '',
    currency: '',
    timezone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSubmitting, setShowSubmitting] = useState(false);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setShowSubmitting(true);
    } else if (fetcher.state === 'idle' && showSubmitting) {
      const timeout = setTimeout(() => {
        setShowSubmitting(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [fetcher.state, showSubmitting]);

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast({
          title: 'Account created!',
          description: 'You can now log in with your new account.',
        });
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          currency: '',
          timezone: '',
        });
        setStep(1);
        setErrors({});
      } else if (fetcher.data.errors) {
        setErrors(fetcher.data.errors);
        toast({
          variant: 'destructive',
          title: 'Account creation failed',
          description: 'Please try again later.',
        });
      }
    }
  }, [fetcher.data, toast]);

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  function validateStep() {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.currency) newErrors.currency = 'Currency is required';
      if (!formData.timezone) newErrors.timezone = 'Timezone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleNext() {
    if (step === 3) {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      fetcher.submit(form, { method: 'post' });
      return;
    }

    if (validateStep()) {
      setStep(step + 1);
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <InputField
              label="Username"
              id="username"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              placeholder="Enter your username"
              type="text"
            />
            <InputField
              label="Password"
              id="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="Create a password"
              type="password"
            />
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              type="password"
            />
            <Button type="button" className="w-full" onClick={handleNext}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        );

      case 2:
        return (
          <>
            <SelectField
              label="Currency"
              value={formData.currency}
              onValueChange={(v) => setFormData((f) => ({ ...f, currency: v as CurrencyCode | '' }))}
              options={currencies}
              error={errors.currency}
              placeholder="Select your currency"
            />
            <SelectField
              label="Timezone"
              value={formData.timezone}
              onValueChange={(v) => setFormData((f) => ({ ...f, timezone: v as TimeZoneCode | '' }))}
              options={timeZones}
              error={errors.timezone}
              placeholder="Select your timezone"
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="button" className="flex-1" onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case 3:
        return (
          <Button className="w-full" onClick={handleNext} disabled={showSubmitting}>
            {showSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg transition-all duration-500 ease-in-out transform">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {icons[step]}
          </div>
          <CardTitle className="text-2xl">{step === 1 ? 'Welcome to 74ccdd' : steps[step]}</CardTitle>
          <CardDescription>
            {
              {
                1: 'Set up your account to start tracking your time',
                2: 'Configure your currency and timezone settings',
                3: 'Create your account and start tracking',
              }[step]
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
}

function InputField({
  label,
  id,
  error,
  ...props
}: {
  label: string;
  id: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Record<string, { name: string }>;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([code, data]) => (
            <SelectItem key={code} value={code}>
              {data.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
