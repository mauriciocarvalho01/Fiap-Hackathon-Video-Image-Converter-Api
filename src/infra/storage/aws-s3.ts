import { Storage } from '@/domain/contracts/gateways'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export class AWSS3 implements Storage {
  private readonly s3Client: S3Client

  constructor (private readonly options: Storage.Options) {
    this.s3Client = new S3Client({
      region: this.options.region,
      credentials: this.options.credentials
    })
  }

  /**
   * Upload a file to S3
   * @param key - The key (path) for the object in the bucket
   * @param body - The content of the file (Buffer, ReadableStream, or string)
   * @returns Promise with upload result
   */
  async upload ({
    key,
    body
  }: Storage.UploadOptions): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.options.bucketName,
      Key: key,
      Body: body,
      ACL: 'public-read' // Define o objeto como público
    })

    await this.s3Client.send(command)
  }
}
