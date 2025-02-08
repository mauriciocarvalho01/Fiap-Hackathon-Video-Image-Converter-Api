import { makeTokenHandler } from '@/main/factories/application/helpers';
import { LoginController } from '@/application/controllers';
import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { User } from '@/infra/repos/entities';
import { makeValidator } from '@/main/factories/application/validation';

type UserLoginAdapter = (controller: LoginController) => RequestHandler;
type GenericType<T = any> = T;

const makeResponseHandler = (
  data: GenericType,
  statusCode: number,
  res: GenericType
) => {
  let errors = {};
  try {
    errors = { errors: JSON.parse(data.message) };
  } catch (error) {
    errors = { errors: data.message };
  }
  const json = [200, 201, 204].includes(statusCode) ? data : errors;
  res.status(statusCode).json(json);
};

export const adaptExpressUserLoginRoute: UserLoginAdapter =
  (controller) => async (req, res) => {
    const { body } = req;
    const userLoginDto = plainToInstance(User, body);

    console.log(userLoginDto);

    const validator = makeValidator();

    const errors = await validator.validate(userLoginDto);

    if (errors.length !== 0) {
      makeResponseHandler({ message: errors }, 400, res);
      return;
    }

    const { statusCode, data } = await controller.handleUserLogin(userLoginDto);

    makeResponseHandler(data, statusCode, res);
  };


  export const adaptExpressUserRegisterRoute: UserLoginAdapter =
  (controller) => async (req, res) => {
    const { body } = req;
    const tokenGenerator = makeTokenHandler()
    body.userId = tokenGenerator.generateUuid()
    const userRegisterDto = plainToInstance(User, body);

    const validator = makeValidator();

    const errors = await validator.validate(userRegisterDto);

    if (errors.length !== 0) {
      makeResponseHandler({ message: errors }, 400, res);
      return;
    }

    const { statusCode, data } = await controller.handleUserRegister(userRegisterDto);

    makeResponseHandler(data, statusCode, res);
  };


