import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req: any, file: Express.Multer.File, cb: Function) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Only image files are allowed'), false);
    }

    cb(null, true);
  },
};
