import { UserAccount as User } from '@/domain/entities/user-account';
import { NoSQLConnection } from '@/infra/repos/mongodb/helpers';
import { UserAccount } from '@/domain/contracts/repos';
import { EntityError } from '@/infra/errors';

export class UserAccountRepository implements UserAccount {
  constructor(private readonly noSQLConnection: NoSQLConnection) {}

  async findOne({ email }: UserAccount.FindUserInput): Promise<UserAccount.FindUserOutput> {
    try {
      const userRepo = await this.noSQLConnection.collection('users');
      const userDataResult = await userRepo.findOne({ email });
      if (userDataResult !== null) {
        return new User({
          userId: userDataResult.userId,
          name: userDataResult.name,
          displayName: userDataResult.displayName,
          email: userDataResult.email,
          password: userDataResult.password,
          role: userDataResult.role,
        });
      }
      return null;
    } catch (error: any) {
      throw new EntityError(error.message);
    }
  }

  async save(userData: UserAccount.InsertUserInput): Promise<boolean> {
    try {
      const userRepo = await this.noSQLConnection.collection('users');
      const saveResult = await userRepo.insertOne(userData);
      return saveResult.insertedId !== undefined
    } catch (error: any) {
      throw new EntityError(error.message);
    }
  }
}
