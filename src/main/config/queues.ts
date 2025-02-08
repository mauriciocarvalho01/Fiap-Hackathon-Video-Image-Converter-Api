import { MessageBroker } from '@/domain/contracts/message-broker';

export const setupMessageBrokerQueues = async (messageBroker: MessageBroker): Promise<void> => {
  await messageBroker.createChannel({
    channelName: 'video-image-converter',
    queueName: 'video-image-converter',
    arguments: {
      durable: true
    }
  }).then(() => void 0)
  await messageBroker.createChannel({
    channelName: 'video-image-status',
    queueName: 'video-image-status',
    arguments: {
      durable: true
    }
  }).then(() => void 0)
};

