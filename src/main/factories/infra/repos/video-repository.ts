import { makeStorage } from '@/main/factories/infra/storage/aws-s3';
import { makeMongoDBConnection } from '@/main/factories/infra/repos/mongodb/helpers/connection';
import { VideoRepository } from '@/infra/repos';

export const makeVideoRepo = (): VideoRepository => {
  return new VideoRepository(makeMongoDBConnection(), makeStorage());
};
