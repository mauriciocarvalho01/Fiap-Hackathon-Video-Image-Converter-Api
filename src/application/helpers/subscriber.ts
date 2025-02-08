import { SubscriberError } from '@/application/errors/subscriber';
export type Response<T = any> = {
  statusCode: string;
  data: T;
};

export const finished = <T = any>(data: T): Response<T> => ({
  statusCode: 'finished',
  data,
});

export const error = <T = any>(data: T): Response<T> => ({
  statusCode: 'error',
  data,
});

export const unexpectedError = (error: unknown): Response<Error> => ({
  statusCode: 'unexpected',
  data: new SubscriberError(error instanceof Error ? error : undefined),
});
