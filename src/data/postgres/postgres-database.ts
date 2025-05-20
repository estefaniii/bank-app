import { DataSource } from 'typeorm';
import { User } from './user.entity'; // Assuming you have these entities defined
import { Pet } from './pet.entity';
import { Doctor } from './doctor.entity';
import { Specie } from './specie.entity';
import { Appointment } from './appointment.entity';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Clase para gestionar la conexión a una base de datos de PostgreSQL utilizando TypeORM.
 *
 * Esta clase configura y administra la conexión a una base de datos incluyendo la inicialización de las entidades: User, Pet, Doctor, Specie y Appointment.
 *
 * La conexión se configura para sincronizar el esquema de la base de datos y utiliza un SSL con `rejectUnauthorized: false` para evitar errores en entorno de desarrollo.
 *
 * @example
 * ```typescript
 * const database = new PostgresDatabase({
 *   host: "localhost",
 *   port: 5432,
 *   username: "postgres",
 *   password: "password",
 *   database: "veterinary",
 * })
 *
 * database.connect().then(() => {}).catch((error) => console.error(error));
 * ```
 */
export class PostgresDatabase {
  public dataSource: DataSource;

  /**
   * Crea una nueva instancia de la conexión a PostgreSQL.
   *
   * @param options - Opciones de configuración para la conexión a la base de datos.
   */
  constructor(options: Options) {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      synchronize: true,
      entities: [User, Pet, Doctor, Specie, Appointment],
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Establece la conexión con la base de datos
   * @returns Promise que se resuelve cuando la conexión es exitosa
   */
  async connect(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log('Database connection established');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión con la base de datos
   * @returns Promise que se resuelve cuando la conexión es cerrada
   */
  async disconnect(): Promise<void> {
    try {
      await this.dataSource.destroy();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}
