export interface Video {
  saveVideo: (
    input: Video.InsertVideoInput
  ) => Promise<boolean>;
  findVideoById: (
    input: Video.FindVideoInput
  ) => Promise<Video.FindVideoOutput[]>;
}

export namespace Video {
  export type GenericType<T = any> = T;

  // Insert Video properties
  export type InsertVideoInput = {
    error?: string;
    videoId: string;
    userId?: string;
    statusUrl?: string;
    uploadedAt?: Date;
    videoData?: GenericType;
    status: string;
    updatedAt?: Date
  };

  // Find Video properties
  export type FindVideoInput = {
    videoId?: string;
    page: number;
    limit: number;
  };

  // Find Video properties
  export type FindVideoOutput = Partial<InsertVideoInput> | null
}
