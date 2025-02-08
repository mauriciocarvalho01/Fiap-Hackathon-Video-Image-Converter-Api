import { makeVideoController } from '@/main/factories/application/controllers';
import { adaptRabbitMQImageConvertVideoStatus } from '@/main/adapters';
import { MessageBroker } from '@/domain/contracts/message-broker';

export const setupMessageBrokerSubscribers = async (messageBroker: MessageBroker): Promise<void> => {
  const consumerOptions = {
    channel: messageBroker.getChannel('video-image-status'),
    queueName: 'video-image-status',
    queuePrefetch: 1,
    messages: [],
    performOptions: {
      mode: 'normal'
    }
  }
  await messageBroker.consumeQueue(consumerOptions,  adaptRabbitMQImageConvertVideoStatus(await makeVideoController()))
};

