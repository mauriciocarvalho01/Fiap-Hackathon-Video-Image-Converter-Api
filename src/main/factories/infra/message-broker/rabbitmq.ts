import { RabbitMQ } from '@/infra/message-broker/rabbitmq';
import { env } from '@/main/config/env';

export const makeMessageBroker = (): RabbitMQ => {
  const messageBroker = RabbitMQ.getInstance({
    host: env.messageBroker.host,
    connectionName: env.appName
  })
  return messageBroker
};
