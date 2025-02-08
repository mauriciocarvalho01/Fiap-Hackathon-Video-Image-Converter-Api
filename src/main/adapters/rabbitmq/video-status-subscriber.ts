import { logger } from '@/infra/helpers';
import { makeMessageBroker } from '@/main/factories/infra/message-broker/rabbitmq';
import { VideoController } from '@/application/controllers';
import { RequestHandler } from 'express';

type VideoAdapter = (controller: VideoController) => RequestHandler;
type GenericType<T = any> = T;
type VideoStatusDto = {
  videoId: string
  status: string
}
const makeResponseHandler = async (
  message: GenericType,
  statusCode: string,
  messageBroker: GenericType
) => {
  const isFinished = ['finished', 'error'].includes(statusCode);
  const videoImageStatusChannel =
  messageBroker.getChannel('video-image-status');
  logger.log(`Message removed with status ${statusCode}`)
  if (isFinished) {
    await messageBroker.ack(videoImageStatusChannel, message.buffer);
    return;
  }
  await messageBroker.rejectAck(videoImageStatusChannel, message.buffer);
};

export const adaptRabbitMQImageConvertVideoStatus: VideoAdapter =
  (controller) =>
  async ({ messages }: GenericType) => {
    for (const message of messages) {
      const videoDto: VideoStatusDto = {
        videoId: message.payload.videoId,
        status: message.payload.status,
      };
      if (videoDto.videoId === undefined || videoDto.status === undefined) {
        logger.warn(`Video ${videoDto.videoId} not found`)
        await makeResponseHandler(message, 'error', makeMessageBroker());
        return;
      }
      const { statusCode } = await controller.handleUpdateVideoStatus(videoDto);
      await makeResponseHandler(message, statusCode, makeMessageBroker());
    }
  };
