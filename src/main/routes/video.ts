import {
  adaptExpressUploadVideoRoute as uploadVideo,
  adaptExpressGetVideoRoute as getVideo,
  uploadSingle as upload,
} from '@/main/adapters';
import { makeVideoController } from '@/main/factories/application/controllers';
import { auth } from '@/main/middlewares';

import { Router } from 'express';

export default (router: Router): void => {
  router.post('/video/upload', auth, upload('file'), uploadVideo(makeVideoController()));
  router.get('/video/status', auth, getVideo(makeVideoController()));
};
