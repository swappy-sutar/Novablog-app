import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageSignatureValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      return file;
    }

    // Double check mimetype is an image
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // SVG files are formatted as XML text files and could contain embedded Javascript (<script> tags).
    // They present high risk of Stored XSS. Block SVG uploads.
    if (file.mimetype.includes('svg') || file.originalname.toLowerCase().endsWith('.svg')) {
      throw new BadRequestException('SVG uploads are not allowed for security reasons');
    }

    // Validate magic numbers (headers) of the image buffer
    const buffer = file.buffer;
    if (!buffer || buffer.length < 4) {
      throw new BadRequestException('Invalid or empty image file');
    }

    const hex = buffer.toString('hex', 0, 12).toUpperCase();

    let isValid = false;

    // JPEG/JPG: Starts with FF D8 FF
    if (hex.startsWith('FFD8FF')) {
      isValid = true;
    }
    // PNG: Starts with 89 50 4E 47 0D 0A 1A 0A
    else if (hex.startsWith('89504E470D0A1A0A')) {
      isValid = true;
    }
    // GIF: Starts with 47 49 46 38 37 61 (GIF87a) or 47 49 46 38 39 61 (GIF89a)
    else if (hex.startsWith('474946383761') || hex.startsWith('474946383961')) {
      isValid = true;
    }
    // WEBP: Starts with 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP) at offset 8
    else if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') {
      isValid = true;
    }

    if (!isValid) {
      throw new BadRequestException(
        'Invalid image content signature. Only JPEG, PNG, GIF, and WEBP image formats are accepted.',
      );
    }

    return file;
  }
}
