import { logger } from '@/infra/helpers';
import {
  ok,
  created,
  notFound,
  HttpResponse,
  Response,
  serverError,
  error,
  finished,
  unexpectedError,
} from '@/application/helpers';
import { VideoHttp, Subscriber } from '@/domain/contracts/gateways';
import { TokenValidator } from '@/domain/contracts/application';
import { MessageBroker } from '@/domain/contracts/message-broker';
import { Video } from '@/domain/contracts/repos';
import { env } from '@/main/config/env';

export class VideoController {
  constructor(
    private readonly videoRepo: Video,
    private readonly messageBroker: MessageBroker,
    private readonly tokenHandler: TokenValidator
  ) {}

  // POST /upload
  async handleUploadVideo(
    createInput: VideoHttp.CreateVideoInput
  ): Promise<HttpResponse<VideoHttp.CreateVideoOutput | Error>> {
    const { userId, name, description, file } = createInput;
    const videoId = this.tokenHandler.generateUuid();
    try {
      const statusUrl = `${env.apiHost}/video/status/${videoId}`;
      const uploadedAt = new Date();
      await this.videoRepo.saveVideo({
        status: 'pending',
        videoId,
        userId,
        statusUrl,
        uploadedAt,
        videoData: { type: 'mp4', name, description, file },
      });
      const videoChannel = this.messageBroker.getChannel(
        'video-image-converter'
      );
      await this.messageBroker.sendToQueue(videoChannel, {
        queueName: 'video-image-converter',
        message: {
          videoId,
          videoType: 'mp4',
        },
      });
      return created({
        videoId,
        status: 'pending',
        uploadedAt,
        statusUrl,
        message:
          'Vídeo enviado para processamento. Recupere o status pela url status Url',
      });
    } catch (error: Video.GenericType) {
      await this.videoRepo.saveVideo({
        status: 'error',
        error: error.message,
        videoId,
        userId,
        videoData: { type: 'mp4', name, description },
      });
      return serverError(error);
    }
  }

  // GET /status/:videoId
  async handleGetVideo(getVideoInput: VideoHttp.GetVideoInput): Promise<
    HttpResponse<VideoHttp.GetVideoOutput[] | Error>
  > {
    try {
      const videos = await this.videoRepo.findVideoById(getVideoInput);
      if (videos === null) return notFound();

      const response = videos
        .filter((video): video is NonNullable<typeof video> => video !== null) // Remove `null` antes do mapeamento
        .map((video) => ({
          ...video,
          videoUrl: `${env.s3.linkFilesUrl}/videos/${video.videoId}.${video.videoData.type}`,
          imagesUrl: `${env.s3.linkFilesUrl}/images/${video.videoId}.zip`,
        }));

      if (response.length === 0) return notFound(); // Caso o array final seja vazio
      return ok(response);
    } catch (error: Video.GenericType) {
      return serverError(error);
    }
  }


  // POST /upload
  async handleUpdateVideoStatus({
    videoId,
    status,
  }: Subscriber.UpdateVideoInput): Promise<
    Response<Subscriber.UpdateVideoOutput | Error>
  > {
    try {
      logger.log(`Updating video ${videoId} status: ${status}`);
      const updatedVideo = await this.videoRepo.saveVideo({
        videoId,
        status,
        updatedAt: new Date(),
      });
      if (updatedVideo) return finished({ videoId, status });
      return error({ videoId, status });
    } catch (error: Subscriber.GenericType) {
      return unexpectedError(error);
    }
  }
}
