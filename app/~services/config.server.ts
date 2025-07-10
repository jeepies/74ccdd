import 'dotenv/config';

interface Config {
  ENVIRONMENT: 'development' | 'production';
  AUTH: {
    COOKIE_NAME: string;
    SECRETS: string[];
  };
}

const config: Config = {
  ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  AUTH: {
    COOKIE_NAME: process.env.COOKIE_NAME ?? 'AUTH',
    SECRETS: process.env.AUTH_SECRET ? [process.env.AUTH_SECRET] : ['super_duper_secret'],
  },
};

export default config;
