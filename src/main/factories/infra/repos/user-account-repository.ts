import { makeMongoDBConnection } from '@/main/factories/infra/repos/mongodb/helpers/connection';
import { UserAccountRepository } from '@/infra/repos';

export const makeUserAccountRepo = (): UserAccountRepository => {
  return new UserAccountRepository(makeMongoDBConnection());
};
