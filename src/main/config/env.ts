export const env = {
  appName: process.env.APP_NAME ?? 'restaurante_acme',
  isProduction: false, //process.env.TS_NODE_DEV === undefined,
  port: process.env.PORT ?? 4000,
  apiAccessKey: process.env.API_ACCESS_KEY,
  apiHost: process.env.API_HOST || 'localhost',
  checkIpAuthorization: /true/.test(
    process.env.CHECK_IP_AUTHORIZATION ?? 'false'
  ),
  whitelistIps: process.env.WHITE_LIST_IPS,
  database: {
    mongodb: {
      uri: process.env.MONGODB_HOST || 'localhost',
      database: process.env.MONGODB_DATABASE || '',
    },
  },
  messageBroker: {
    host: process.env.MESSAGE_BROKER_HOST ?? 'amqp://localhost:5672'
  },
  s3: {
    linkFilesUrl: process.env.AWS_S3_LINK_FILES_URL ?? 'http://localhost',
    bucketName: process.env.AWS_S3_BUCKET_NAME ?? 'any_bucket_name',
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'any_key_id',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'any_secret_access_key'
    }
  }
};
