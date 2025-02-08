import { logger } from '@/infra/helpers';
export class SubscriberError extends Error {
  constructor(error?: Error) {
    super('Subscriber failed. Message cannot be processed');
    this.name = 'Subscriber';
    this.stack = error?.stack;
    logger.error(`[${this.name}] ${error?.message}`);
  }
}
