import { VideoRepository } from '@/infra/repos/video-repository';
import { Db, Collection, ObjectId } from 'mongodb';
import { jest } from '@jest/globals';
import { Storage } from '@/domain/contracts/gateways';
import { EntityError } from '@/infra/errors';

describe('VideoRepository', () => {
  let sut: VideoRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: jest.Mocked<Collection>;
  let mockStorage: jest.Mocked<Storage>;

  beforeEach(() => {
    // Mock da coleção
    mockCollection = {
      insertOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    // Mock do Db
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Db>;

    // Mock do Storage
    mockStorage = {
      upload: jest.fn(),
    } as unknown as jest.Mocked<Storage>;

    sut = new VideoRepository(mockDb, mockStorage);
  });

  describe('saveVideo', () => {
    const videoData = {
      videoId: 'video-123',
      userId: 'user-123',
      status: 'pending',
      videoData: {
        type: 'mp4',
        file: { buffer: Buffer.from('file-content') },
      },
    };

    it('should return true when the video is successfully saved', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: new ObjectId(), acknowledged: true });
      mockStorage.upload.mockResolvedValue(undefined);

      const result = await sut.saveVideo(videoData);

      expect(result).toBe(true);
      expect(mockDb.collection).toHaveBeenCalledWith('video-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(videoData);
      expect(mockStorage.upload).toHaveBeenCalledWith({
        key: `videos/${videoData.videoId}.${videoData.videoData.type}`,
        body: videoData.videoData.file.buffer,
      });
    });

    it('should return false when insertOne does not insert a document', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: undefined as unknown as ObjectId, acknowledged: false });
      mockStorage.upload.mockResolvedValue(undefined);

      const result = await sut.saveVideo(videoData);

      expect(result).toBe(false);
      expect(mockDb.collection).toHaveBeenCalledWith('video-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(videoData);
    });

    it('should throw an EntityError when an exception occurs', async () => {
      const errorMessage = 'Database connection failed';
      mockCollection.insertOne.mockRejectedValue(new Error(errorMessage));
      mockStorage.upload.mockResolvedValue(undefined);

      await expect(sut.saveVideo(videoData)).rejects.toThrowError(EntityError);
      expect(mockDb.collection).toHaveBeenCalledWith('video-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(videoData);
    });

    it('should throw an EntityError if upload fails', async () => {
      const errorMessage = 'Upload failed';
      mockStorage.upload.mockRejectedValue(new Error(errorMessage));

      await expect(sut.saveVideo(videoData)).rejects.toThrowError(EntityError);
      expect(mockStorage.upload).toHaveBeenCalledWith({
        key: `videos/${videoData.videoId}.${videoData.videoData.type}`,
        body: videoData.videoData.file.buffer,
      });
    });
  });
});
