import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envs } from './config/envs';
import { AppDataSource, initializeDatabase } from './data/data-source';
import { AuthRoutes } from './modules/auth/auth.routes';
import { TransactionRoutes } from './modules/transaction/transaction.routes';
import { UserRoutes } from './modules/user/user.routes';

// Validar variables de entorno antes de iniciar
const requiredVars = [
  'PORT',
  'NODE_ENV',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'JWT_KEY',
  'JWT_EXPIRE_IN',
  'MAILER_SERVICE',
  'MAILER_EMAIL',
  'MAILER_SECRET_KEY',
  'SEND_MAIL',
  'DATABASE_URL',
] as const;

const missingVars = requiredVars.filter((varName) => !(envs as any)[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

async function bootstrap() {
  try {
    // 1. Inicializar base de datos
    await initializeDatabase();
    console.log('✅ Database connection established');

    // 2. Configurar Express
    const app = express();

    // 3. Middlewares básicos (orden es importante)
    app.use(express.json({ limit: '10kb' })); // Limitar tamaño del payload
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(morgan(envs.NODE_ENV === 'development' ? 'dev' : 'combined'));

    // 4. Middlewares de seguridad
    app.use(helmet());
    app.use(
      cors({
        origin:
          envs.NODE_ENV === 'production'
            ? 'https://yourbankdomain.com'
            : 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }),
    );

    // 5. Rate limiting (excluir health check)
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100,
        message: 'Too many requests from this IP, please try again later',
        skip: (req) => req.url === '/health',
      }),
    );

    // 6. Rutas API (versión 1)
    app.use('/api/v1/auth', AuthRoutes.routes);
    app.use('/api/v1/transactions', TransactionRoutes.routes);
    app.use('/api/v1/users', UserRoutes.routes);

    // 7. Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: AppDataSource.isInitialized ? 'CONNECTED' : 'DISCONNECTED',
        environment: envs.NODE_ENV,
        version: '1.0.0',
      });
    });

    // 8. Manejo de rutas no encontradas
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
      });
    });

    // 9. Manejador global de errores (DEBE ir al final)
    app.use(
      (
        error: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        console.error('❌ Unhandled error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );

    // 10. Iniciar servidor
    const server = app.listen(envs.PORT, () => {
      console.log(
        `🚀 Server running in ${envs.NODE_ENV} mode on port ${envs.PORT}`,
      );
    });

    // 11. Manejo de cierre elegante
    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Función para cierre elegante
async function shutdown(server: any) {
  console.log('🛑 Received shutdown signal, closing server gracefully...');

  server.close(async () => {
    await AppDataSource.destroy();
    console.log('🛑 Server closed');
    process.exit(0);
  });

  // Forzar cierre después de 5 segundos si no se completa
  setTimeout(() => {
    console.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 5000);
}

// Iniciar la aplicación
bootstrap();
