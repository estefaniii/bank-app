import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  NODE_ENV: get('NODE_ENV').required().asString(),

  DATABASE_USERNAME: get('DATABASE_USERNAME').required().asString(),
  DATABASE_PASSWORD: get('DATABASE_PASSWORD').required().asString(),
  DATABASE_HOST: get('DATABASE_HOST').required().asString(),
  DATABASE_PORT: get('DATABASE_PORT').required().asPortNumber(),
  DATABASE_NAME: get('DATABASE_NAME').required().asString(),

  JWT_KEY: get('JWT_KEY').required().asString(),
  JWT_EXPIRE_IN: get('JWT_EXPIRE_IN').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  SEND_MAIL: get('SEND_MAIL').required().asBool(),

  ADMIN_EMAIL: get('ADMIN_EMAIL').default('admin@bankapp.com').asString(),
  ADMIN_PASSWORD: get('ADMIN_PASSWORD').default('Admin1234').asString(),
  SYSTEM_ACCOUNT_PASSWORD: get('SYSTEM_ACCOUNT_PASSWORD')
    .default('SystemPass123')
    .asString(),

  // --- ¡NUEVAS LÍNEAS AQUÍ para leer las variables que faltaban! ---
  DATABASE_URL: get('DATABASE_URL').required().asString(), // Tu URL completa de Neon.tech
  DB_SSL: get('DB_SSL').default('true').asBool(), // Lee DB_SSL, por defecto 'true' y como booleano
  DB_LOGGING: get('DB_LOGGING').default('false').asBool(),
};
