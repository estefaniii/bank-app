import 'reflect-metadata';
import { PostgresDatabase } from './data';
import { envs } from './config/env';
import { Server } from './server';
import { AppRoutes } from './routes';

async function main() {
  try {
    // Initialize database connection
    const postgres = new PostgresDatabase({
      username: envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT, // No need for Number() since env-var already converts it
      database: envs.DATABASE_NAME,
    });

    await postgres.connect();
    console.log('✅ Database connected successfully');

    // Start the server
    const server = new Server({
      port: envs.PORT, // No need for Number() since env-var already converts it
      routes: AppRoutes.routes,
    });

    await server.start();
    console.log(`🚀 Server running on port ${envs.PORT}`);
    
  } catch (error) {
    console.error('❌ Application failed to start:', error);
    process.exit(1);
  }
}

// Start the application
main();


@Column('timestamp', {
  default: () => 'CURRENT_TIMESTAMP', // Sets default to current timestamp
  nullable: false // Makes the column required
})
created_at: Date; // Or updated_at if you prefer