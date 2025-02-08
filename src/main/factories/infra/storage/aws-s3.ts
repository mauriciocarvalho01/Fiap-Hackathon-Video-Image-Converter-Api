import { AWSS3 } from '@/infra/storage/aws-s3';
import { env } from '@/main/config/env';

export const makeStorage = (): AWSS3 => {
 return new AWSS3(env.s3)
};
