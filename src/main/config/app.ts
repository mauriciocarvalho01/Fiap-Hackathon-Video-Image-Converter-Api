import { makeMessageBroker } from './../factories/infra/message-broker/rabbitmq';
import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';
import express from 'express';

const messageBroker = makeMessageBroker()
const app = express();
setupMiddlewares(app);
setupRoutes(app);
export { app };
