import { VideoHttp } from '@/domain/contracts/gateways';
import { VideoController } from '@/application/controllers';
import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { Video } from '@/infra/repos/entities';
import { makeValidator } from '@/main/factories/application/validation';

type VideoAdapter = (controller: VideoController) => RequestHandler;
type GenericType<T = any> = T;

const makeResponseHandler = (
  data: GenericType,
  statusCode: number,
  res: GenericType
) => {
  let errors = {};
  try {
    errors = { errors: JSON.parse(data.message) };
  } catch (error) {
    errors = { errors: data.message };
  }
  const json = [200, 201, 204].includes(statusCode) ? data : errors;
  res.status(statusCode).json(json);
};

export const adaptExpressUploadVideoRoute: VideoAdapter =
  (controller) => async (req, res) => {
    const { body, file } = req;
    const videoDto = plainToInstance(Video, {...body, file });

    const validator = makeValidator();

    const errors = await validator.validate(videoDto);

    if (errors.length !== 0) {
      makeResponseHandler({ message: errors }, 400, res);
      return;
    }

    const { statusCode, data } = await controller.handleUploadVideo(videoDto);

    makeResponseHandler(data, statusCode, res);
  };

  export const adaptExpressGetVideoRoute: VideoAdapter =
  (controller) => async (req, res) => {
    const { query } = req;

    const videoDto: VideoHttp.GetVideoInput = {
      videoId: query.videoId as string || '', // Define como uma string vazia se for undefined
      page: query.page ? parseInt(query.page as string, 10) : 1, // Define como 1 (primeira página) se for undefined
      limit: query.limit ? parseInt(query.limit as string, 10) : 10, // Define como 10 (limite padrão) se for undefined
    };

    const { statusCode, data } = await controller.handleGetVideo(videoDto);

    makeResponseHandler(data, statusCode, res);
  };

