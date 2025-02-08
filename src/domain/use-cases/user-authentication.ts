import { RegisterError } from '@/domain/entities/errors/register';
import { UserAccount } from '@/domain/contracts/repos';
import { TokenValidator } from '@/domain/contracts/application/helpers';
import { AccessToken, AuthenticationError } from '@/domain/entities'

type Setup = (userAccountRepo: UserAccount, tokenGenerator: TokenValidator) => UserAuthentication
type Output = { accessToken: string, expireIn: number }
type Input = { email: string, password: string }
export type UserAuthentication = (input: Input) => Promise<Output>

export const setupUserAuthentication: Setup = (userAccountRepo, tokenGenerator) => async input => {
  const userData = await userAccountRepo.findOne({ email: input.email })
  if (userData === null) throw new AuthenticationError()
  const passwordMatch = await tokenGenerator.verifyPassword(input.password, userData.password)
  if (!passwordMatch) throw new AuthenticationError()
  const accessToken = tokenGenerator.generateJwt({ ...userData }, AccessToken.expirationInMs)
  return { accessToken, expireIn: AccessToken.expirationInMs }
}

export const setupUserRegisterAuthentication: Setup = (userAccountRepo, tokenGenerator) => async input => {
  const userData = await userAccountRepo.findOne({ email: input.email })
  if (userData !== null) throw new RegisterError("User has already been registered")
  const hashedPassword = await tokenGenerator.hashPassword(input.password);
  await userAccountRepo.save({...input, password: hashedPassword })
  return { accessToken: '', expireIn: 0 }
}

