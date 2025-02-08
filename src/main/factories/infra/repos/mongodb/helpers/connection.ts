import { MongoDBConnection, NoSQLConnection } from '@/infra/repos/mongodb/helpers';

export const makeMongoDBConnection = (): NoSQLConnection => {
  const noSQLDatabase = MongoDBConnection.getInstance();
  return noSQLDatabase.getConnection()
};
