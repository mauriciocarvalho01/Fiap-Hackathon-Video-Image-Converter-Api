import { makeTokenHandler } from '@/main/factories/application/helpers';
import { makeValidator } from '@/main/factories/application/validation';
import { AuthenticationMiddleware } from '@/application/middlewares';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeTokenHandler(), makeValidator());
};
