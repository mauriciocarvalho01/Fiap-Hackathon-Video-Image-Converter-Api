import { makeUserAuthentication, makeUserRegisterAuthentication } from '@/main/factories/domain/use-cases';
import { LoginController } from '@/application/controllers';


export const makeLoginController = (): LoginController => {
  return new LoginController(makeUserAuthentication(), makeUserRegisterAuthentication());
};
