import { Storage } from '@/domain/contracts/gateways';
import { NoSQLConnection } from '@/infra/repos/mongodb/helpers';
import { Video } from '@/domain/contracts/repos';
import { EntityError } from '@/infra/errors';

export class VideoRepository implements Video {
  constructor(
    private readonly noSQLConnection: NoSQLConnection,
    private readonly storage: Storage
  ) {}

  async saveVideo(
    insertVideoInput: Video.InsertVideoInput
  ): Promise<boolean> {
    try {
      const { videoId, videoData } = insertVideoInput;

      // Upload do arquivo de vídeo, caso exista
      if (videoData !== undefined && videoData.file) {
        await this.storage.upload({
          key: `videos/${videoId}.${videoData.type}`,
          body: videoData.file.buffer,
        });
        delete insertVideoInput.videoData.file; // Remove o arquivo após upload
      }

      // Conexão com o repositório de vídeos
      const videoRepo = await this.noSQLConnection.collection('video-status');

      // Realiza o upsert
      const saveResult = await videoRepo.updateOne(
        { videoId }, // Filtro para encontrar o vídeo pelo videoId
        { $set: insertVideoInput }, // Dados a serem atualizados/inseridos
        { upsert: true } // Configuração para criar o documento se ele não existir
      );

      // Verifica se o documento foi inserido ou atualizado com sucesso
      return saveResult.upsertedCount > 0 || saveResult.modifiedCount > 0;
    } catch (error: any) {
      throw new EntityError(error.message);
    }
  }


  async findVideoById(
    { videoId, page = 1, limit = 10 }: Video.FindVideoInput
  ): Promise<Video.FindVideoOutput[]> {
    try {
      const videoRepo = await this.noSQLConnection.collection('video-status');
      const query = videoId ? { videoId } : {};

      // Calcular o offset (número de documentos a pular)
      const skip = (page - 1) * limit;

      // Aplicar paginação com skip e limit
      const videoDataResult = await videoRepo
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray() as Video.FindVideoOutput[];

      return videoDataResult;
    } catch (error: any) {
      throw new EntityError(error.message);
    }
  }

}
