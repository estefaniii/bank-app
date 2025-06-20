import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envs } from './config/envs';
import { AppDataSource, initializeDatabase } from './data/data-source';
import { handleError } from './services/handle.error';
import { AuthRoutes } from './modules/auth/auth.routes';
import { TransactionRoutes } from './modules/transaction/transaction.routes';
import { UserRoutes } from './modules/user/user.routes';

async function main() {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    console.log('✅ ¡Conexión a la base de datos exitosa!');

    // Inicializar Express
    const app = express();

    // Middlewares de seguridad
    app.use(helmet());
    app.use(
      cors({
        origin:
          envs.NODE_ENV === 'production'
            ? ['https://yourbankdomain.com']
            : ['http://localhost:3000'],
        credentials: true,
      }),
    );

    // Rate limiting
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later',
      }),
    );

    // Otros middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan(envs.NODE_ENV === 'development' ? 'dev' : 'combined'));

    // Rutas
    app.use('/api/auth', AuthRoutes.routes);
    app.use('/api/transactions', TransactionRoutes.routes);
    app.use('/api/users', UserRoutes.routes);

    // Health check
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        database: AppDataSource.isInitialized ? 'CONNECTED' : 'DISCONNECTED',
        environment: envs.NODE_ENV,
      });
    });

    // Middleware de manejo de errores
    app.use(
      (
        err: unknown,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        handleError(err, res);
      },
    );

    // Iniciar servidor
    app.listen(envs.PORT, () => {
      console.log(
        `🚀 Server running in ${envs.NODE_ENV} mode on port ${envs.PORT}`,
      );
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

main();
