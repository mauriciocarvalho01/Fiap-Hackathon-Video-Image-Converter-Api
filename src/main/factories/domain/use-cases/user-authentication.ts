import { makeTokenHandler } from '@/main/factories/application/helpers';
import { makeUserAccountRepo } from '@/main/factories/infra/repos'
import { setupUserAuthentication, setupUserRegisterAuthentication, UserAuthentication } from '@/domain/use-cases'

export const makeUserAuthentication = (): UserAuthentication => {
  return setupUserAuthentication(
    makeUserAccountRepo(),
    makeTokenHandler()
  )
}

export const makeUserRegisterAuthentication = (): UserAuthentication => {
  return setupUserRegisterAuthentication(
    makeUserAccountRepo(),
    makeTokenHandler()
  )
}
