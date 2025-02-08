import { Video } from '@/domain/contracts/repos';

export namespace VideoHttp {
  // API types contracts
  export type GenericType<T = any> = T;

  // POST video
  export type CreateVideoInput = {
    /** Nome do vídeo */
    name: string;

    /** Descrição do vídeo */
    description?: string;

    /** ID do usuário que está enviando o vídeo */
    userId: string;

    /** Arquivo do vídeo em formato multipart/form-data */
    file: File;

    /** Metadados adicionais */
    metadata?: {
      /** Tags para classificação do vídeo */
      tags?: string[];
      /** Resolução preferida das geradas imagens no video */
      imageResolution?: {
        width: number;  // Largura da imagem
        height: number; // Altura da imagem
      };
    };
  };

  export type CreateVideoOutput = {
    /** ID único do vídeo gerado */
    videoId: string;

    /** Status inicial do processamento */
    status: "pending";

    /** Data e hora do envio */
    uploadedAt: Date;

    /** URL para acompanhar o status do vídeo */
    statusUrl: string;

    /** Mensagem de confirmação */
    message: string;
  };

  export type GetVideoOutput = Partial<Video.InsertVideoInput>
  &  {
    videoUrl: string
  }

  export type GetVideoInput = Video.FindVideoInput
}
