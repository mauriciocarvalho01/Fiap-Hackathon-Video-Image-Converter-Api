import { Validator, Validation } from '@/application/validation';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as validator from  'class-validator';

interface IsFileOptions {
  mime: ('application/video' | 'video/mp4')[];
}

export function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
      return registerDecorator({
          name: 'isFile',
          target: object.constructor,
          propertyName: propertyName,
          constraints: [],
          options: validationOptions,
          validator: {
              validate(value: any, args: ValidationArguments) {
                  if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
                      return true;
                  }
                  return false;
              },
          }
      });
  }
}

export const makeValidator = (): Validator.GenericType => {
  return new Validation(validator);
};
