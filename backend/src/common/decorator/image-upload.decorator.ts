import {
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config'; 

export function ImageUpload(
  fieldName = 'image',
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, multerOptions),
    ),
  );
}