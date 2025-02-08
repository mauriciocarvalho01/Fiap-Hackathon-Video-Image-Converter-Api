import { TokenHandler } from '@/application/helpers/token-handler';
import { TokenValidator } from '@/domain/contracts/application';
import { env } from '@/main/config/env';

export const makeTokenHandler = (): TokenValidator => {
  return new TokenHandler(env.apiAccessKey);
};
