import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { envs } from '../config/envs';
import bcrypt from 'bcryptjs';
import {
  generateAccountNumber,
  BankPrefix,
} from '../utils/generateAccountNumber';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Usa la cadena de conexión completa para mayor claridad
  url:
    envs.DATABASE_URL ||
    `postgresql://${envs.DATABASE_USERNAME}:${envs.DATABASE_PASSWORD}@${envs.DATABASE_HOST}:${envs.DATABASE_PORT}/${envs.DATABASE_NAME}`,
  // Configuración SSL específica para Neon.tech
  ssl: envs.DB_SSL ? { rejectUnauthorized: false } : undefined,
  extra: {
    ssl: envs.DB_SSL
      ? { rejectUnauthorized: false } // Necesario para Neon.tech
      : undefined,
    connectionLimit: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  synchronize: envs.NODE_ENV === 'development',
  logging: envs.DB_LOGGING ? ['query', 'error', 'warn'] : ['error', 'warn'],
  entities: [User, Transaction],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: [],
  cache: {
    duration: 30000, // 30 segundos de cache
  },
  // Mejor manejo de conexiones
  poolSize: 10,
  maxQueryExecutionTime: 3000, // 3 segundos máximo por query
});

/**
 * Inicializa la conexión a la base de datos con reintentos
 */
export const initializeDatabase = async (): Promise<void> => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 segundos entre reintentos

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await AppDataSource.initialize();
      console.log('✅ Database connection established');

      if (envs.NODE_ENV === 'development') {
        await seedDatabase();
      }
      return;
    } catch (error) {
      console.error(
        `❌ Connection attempt ${attempt} failed:`,
        error instanceof Error ? error.message : error,
      );

      if (attempt === maxRetries) {
        console.error('Failed to connect to database after multiple attempts');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

/**
 * Datos iniciales para desarrollo
 */
async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding database...');
    await Promise.all([ensureAdminUserExists(), ensureSystemAccountsExist()]);
    console.log('🌱 Database seeding completed');
  } catch (error) {
    console.error('⚠️ Database seeding failed:', error);
  }
}

/**
 * Crea usuario admin si no existe
 */
async function ensureAdminUserExists(): Promise<void> {
  const userRepository = AppDataSource.getRepository(User);
  const adminEmail = envs.ADMIN_EMAIL || 'admin@bankapp.com';
  const adminPassword = envs.ADMIN_PASSWORD || 'Admin1234';

  if (!(await userRepository.existsBy({ email: adminEmail }))) {
    const adminUser = userRepository.create({
      name: 'System Admin',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      accountNumber: generateAccountNumber(BankPrefix.ADMIN), // Prefijo para admin
      balance: 10000,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(adminUser);
    console.log('👨‍💻 Admin user created');
  }
}

/**
 * Crea cuentas del sistema si no existen
 */
async function ensureSystemAccountsExist(): Promise<void> {
  const userRepository = AppDataSource.getRepository(User);
  const systemPassword = await bcrypt.hash(
    envs.SYSTEM_ACCOUNT_PASSWORD || 'SystemPass123',
    12,
  );

  const systemAccounts = [
    {
      name: 'Interest Account',
      email: 'interest@bankapp.com',
      password: systemPassword,
      accountNumber: 'INT000000001', // Prefijo INT para intereses
      balance: 0,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      name: 'Fee Account',
      email: 'fees@bankapp.com',
      password: systemPassword,
      accountNumber: 'FEE000000001', // Prefijo FEE para tarifas
      balance: 0,
      role: UserRole.ADMIN,
      isActive: true,
    },
  ];

  for (const account of systemAccounts) {
    if (
      !(await userRepository.existsBy({ accountNumber: account.accountNumber }))
    ) {
      await userRepository.save(userRepository.create(account));
    }
  }
}

/**
 * Cierra la conexión de forma segura
 */
export const closeDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.destroy();
      console.log('🛑 Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
    }
  }
};
