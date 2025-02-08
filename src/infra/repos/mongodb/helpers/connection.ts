import { logger } from '@/infra/helpers';
import { MongoClient, Db, Collection } from "mongodb";

export type NoSQLConnection = Db
export type NoSQLCollection = Collection

type GenericType<T=any> = T

export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {
    // Singleton: Construtor privado para evitar instâncias diretas
  }

  /**
   * Retorna a instância única da classe.
   */
  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  /**
   * Conecta ao MongoDB.
   * @param uri - URI de conexão do MongoDB.
   * @param dbName - Nome do banco de dados.
   * @returns Uma instância do banco de dados.
   */
  public async connect({ uri, dbName }: { uri: string, dbName: string }): Promise<Db> {
    if (this.db) {
      logger.log(`Connecting to ${dbName} already connected`);
      return this.db;
    }

    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      logger.log(`Database connected: ${dbName}`);
      return this.db;
    } catch (error: GenericType) {
     logger.error(`Error connecting to database: ${error.message}`);
      throw error;
    }
  }

  public getConnection(): Db {
    if(this.db === null) throw new Error("Database not initialized")
    return this.db
  }
}
