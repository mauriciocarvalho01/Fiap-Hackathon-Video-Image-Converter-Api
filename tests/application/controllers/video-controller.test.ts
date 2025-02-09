import { VideoController } from '@/application/controllers/video-controller';
import { VideoHttp } from '@/domain/contracts/gateways';
import { MessageBroker } from '@/domain/contracts/message-broker';
import { Video } from '@/domain/contracts/repos';
import { TokenValidator } from '@/domain/contracts/application';
import { mock, MockProxy } from 'jest-mock-extended';
import { created, serverError } from '@/application/helpers';

describe('VideoController', () => {
  let sut: VideoController;
  let mockVideoRepo: MockProxy<Video>;
  let mockMessageBroker: MockProxy<MessageBroker>;
  let mockTokenHandler: MockProxy<TokenValidator>;
  let envMock: { apiHost: string };

  beforeEach(() => {
    mockVideoRepo = mock();
    mockMessageBroker = mock();
    mockTokenHandler = mock();
    envMock = { apiHost: 'http://localhost:4082' };

    sut = new VideoController(mockVideoRepo, mockMessageBroker, mockTokenHandler);
  });

  describe('handleUploadVideo', () => {
    const mockFile = {
      lastModified: Date.now(),
      name: 'file.mp4',
      webkitRelativePath: '',
      size: Buffer.byteLength('file-content'),
      type: 'video/mp4',
      slice: jest.fn(),
    } as unknown as File;

    const input: VideoHttp.CreateVideoInput = {
      userId: 'user-123',
      name: 'sample-video.mp4',
      description: 'A sample video',
      file: mockFile,
    };

    it('should return created when video is uploaded successfully', async () => {
      const videoId = 'video-456';
      const videoChannel = { queueName: 'video-image-converter' };

      mockTokenHandler.generateUuid.mockReturnValue(videoId);
      mockMessageBroker.getChannel.mockReturnValue(videoChannel);
      mockMessageBroker.sendToQueue.mockResolvedValue(true);
      mockVideoRepo.saveVideo.mockResolvedValue(true);

      const response = await sut.handleUploadVideo(input);

      expect(response).toEqual(
        created({
          videoId,
          status: 'pending',
          uploadedAt: expect.any(Date),
          statusUrl: "http://localhost:4081/v1/api/video/status/video-456",
          message: 'Vídeo enviado para processamento. Recupere o status pela url status Url',
        })
      );
      expect(mockTokenHandler.generateUuid).toHaveBeenCalled();
      expect(mockMessageBroker.getChannel).toHaveBeenCalledWith('video-image-converter');
      expect(mockMessageBroker.sendToQueue).toHaveBeenCalledWith(videoChannel, {
        queueName: 'video-image-converter',
        message: { videoId, videoType: "mp4" },
      });
      expect(mockVideoRepo.saveVideo).toHaveBeenCalledWith({
        status: 'pending',
        videoId,
        userId: input.userId,
        videoData: {
          type: 'mp4',
          name: input.name,
          description: input.description,
          file: input.file,
        },
      });
    });

    it('should return server error and save error video when an exception occurs', async () => {
      const error = new Error('Some error occurred');
      const videoId = 'video-456';
      const videoChannel = { queueName: 'video-image-converter' };

      mockTokenHandler.generateUuid.mockReturnValue(videoId);
      mockMessageBroker.getChannel.mockReturnValue(videoChannel);
      mockMessageBroker.sendToQueue.mockRejectedValue(error);

      const response = await sut.handleUploadVideo(input);

      expect(response).toEqual(serverError(error));
      expect(mockTokenHandler.generateUuid).toHaveBeenCalled();
      expect(mockMessageBroker.getChannel).toHaveBeenCalledWith('video-image-converter');
      expect(mockMessageBroker.sendToQueue).toHaveBeenCalledWith(videoChannel, {
        queueName: 'video-image-converter',
        message: { videoId, videoType: 'mp4' },
      });
      expect(mockVideoRepo.saveVideo).toHaveBeenCalledWith({
        status: "pending",
        statusUrl: "http://localhost:4081/v1/api/video/status/video-456",
        uploadedAt: "2025-02-09T21:17:13.660Z",
        videoId,
        userId: input.userId,
        videoData: {
          type: 'mp4',
          name: input.name,
          description: input.description,
          file: input.file,
        },
      });
    });
  });
});
