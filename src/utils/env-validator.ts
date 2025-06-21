import { envs } from '../config/envs';

export function validateEnv() {
  const requiredVars = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_KEY',
    'JWT_EXPIRE_IN',
  ] as const;

  const missingVars = requiredVars.filter((varName) => !(envs as any)[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  if (!['development', 'production', 'test'].includes(envs.NODE_ENV)) {
    throw new Error('NODE_ENV must be either development, production or test');
  }
}
