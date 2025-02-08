import {
  adaptExpressUserLoginRoute as Login,
} from '@/main/adapters';
import { makeLoginController } from '@/main/factories/application/controllers';


import { Router } from 'express';

export default (router: Router): void => {
  router.post('/login', Login(makeLoginController()));
};
