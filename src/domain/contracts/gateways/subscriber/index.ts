export namespace Subscriber {
  export type GenericType<T=any> = T
  export type UpdateVideoInput = {
    videoId: string;
    status: string;
  };
  export type UpdateVideoOutput = {
    videoId: string;
    status: string;
  };
}
