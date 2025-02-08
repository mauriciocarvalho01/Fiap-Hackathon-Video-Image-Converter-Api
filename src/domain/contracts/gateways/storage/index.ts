import { Readable } from 'stream';

export interface Storage {
  upload: (options: Storage.UploadOptions) => Promise<void>;
}

export namespace Storage {
  export type Options = {
    linkFilesUrl: string;
    bucketName: string;
    region: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
  };
  export type UploadOptions = {
    key: string;
    body: Buffer | Readable | string;
    acl?:
      | 'private'
      | 'public-read'
      | 'public-read-write'
      | 'authenticated-read';
  };
}
