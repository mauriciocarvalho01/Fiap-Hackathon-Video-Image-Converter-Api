import { UserData } from '@/domain/entities/user-account';
export interface UserAccount {
  findOne: (
    { email }: UserAccount.FindUserInput
  ) => Promise<UserAccount.FindUserOutput>
  save: (userData: UserAccount.InsertUserInput) => Promise<boolean>
}

export namespace UserAccount {
  export type GenericType<T = any> = T;

  // Find User properties
  export type FindUserInput = Partial<UserData>

  // Find User properties
  export type FindUserOutput = UserData | null

  export type InsertUserInput = UserData
}
