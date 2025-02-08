import { makeTokenHandler } from '@/main/factories/application/helpers';
import {
  makeVideoRepo,
} from '@/main/factories/infra/repos';
import { VideoController } from '@/application/controllers';
import { makeMessageBroker } from '@/main/factories/infra/message-broker/rabbitmq';

export const makeVideoController = (): VideoController => {
  return new VideoController(
    makeVideoRepo(),
    makeMessageBroker(),
    makeTokenHandler()
  );
};
