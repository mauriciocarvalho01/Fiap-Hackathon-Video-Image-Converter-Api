import { MongoDBConnection } from '@/infra/repos/mongodb/helpers';
import { logger } from '@/infra/helpers';
import { Db, MongoClient } from 'mongodb';
import { mock, MockProxy } from 'jest-mock-extended';
import { env } from '@/main/config/env';

jest.mock('@/infra/helpers/logger');
jest.mock('mongodb');

describe('MongoDBConnection', () => {
  let sut: MongoDBConnection;
  let clientMock: MockProxy<MongoClient>;
  let mockDb: MockProxy<Db>;

  beforeAll(() => {
    clientMock = mock<MongoClient>();
    mockDb = mock<Db>();

    jest
      .spyOn(MongoClient.prototype, 'connect')
      .mockImplementation(async () => clientMock);
    jest.spyOn(MongoClient.prototype, 'db').mockReturnValue(mockDb);
  });

  beforeEach(() => {
    sut = MongoDBConnection.getInstance();
    sut['client'] = clientMock; // Inicializa o cliente mockado
    sut['db'] = mockDb; // Inicializa o banco mockado
  });

  afterEach(() => {
    jest.clearAllMocks();
    sut['db'] = null;
    sut['client'] = null;
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = MongoDBConnection.getInstance();
      const instance2 = MongoDBConnection.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('connect', () => {
    it('should connect to the database if not already connected', async () => {
      sut['client'] = null; // Garante que o cliente será inicializado no teste
      sut['db'] = null; // Garante que o o db será inicializado no teste

      await sut.connect({
        uri: env.database.mongodb.uri,
        dbName: env.database.mongodb.database,
      });

      expect(logger.log).toHaveBeenCalledWith(
        `Database connected: ${env.database.mongodb.database}`
      );
      expect(MongoClient.prototype.connect).toHaveBeenCalledTimes(1);
      expect(MongoClient.prototype.db).toHaveBeenCalledWith(
        env.database.mongodb.database
      );
    });

    it('should not reconnect if already connected', async () => {
      const db = await sut.connect({
        uri: env.database.mongodb.uri,
        dbName: env.database.mongodb.database,
      });

      expect(MongoClient.prototype.connect).not.toHaveBeenCalled();
      expect(db).toBe(mockDb);
      expect(logger.log).toHaveBeenCalledWith(
        `Connecting to ${env.database.mongodb.database} already connected`
      );
    });

    it('should throw an error if connection fails', async () => {
      sut['client'] = null; // Garante que o cliente será inicializado no teste
      sut['db'] = null; // Garante que o o db será inicializado no teste

      const error = new Error('Connection failed');
      jest.spyOn(MongoClient.prototype, 'connect').mockRejectedValueOnce(error);

      await expect(
        sut.connect({ uri: 'invalid-uri', dbName: 'invalid-db' })
      ).rejects.toThrow('Connection failed');
      expect(logger.error).toHaveBeenCalledWith(
        `Error connecting to database: ${error.message}`
      );
    });
  });

  describe('getConnection', () => {
    it('should throw an error if database is not initialized', () => {
      sut['db'] = null;

      expect(() => sut.getConnection()).toThrow('Database not initialized');
    });

    it('should return the database instance if initialized', () => {
      const db = sut.getConnection();
      expect(db).toBe(mockDb);
    });
  });

  // describe('disconnect', () => {
  //   it('should disconnect from MongoDB if client is initialized', async () => {
  //     await sut['client']?.close();

  //     expect(clientMock.close).toHaveBeenCalled();
  //   });

  //   it('should not attempt to disconnect if client is not initialized', async () => {
  //     sut['client'] = null;

  //     await sut.disconnect();

  //     expect(clientMock.close).not.toHaveBeenCalled();
  //   });
  // });
});
