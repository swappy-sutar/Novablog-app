import { HttpException, HttpStatus } from '@nestjs/common';

export const errorResponse = (
  message: string,
  statusCode: number = HttpStatus.BAD_REQUEST,
) => {
  throw new HttpException(
    {
      success: false,
      statusCode,
      message,
    },
    statusCode,
  );
};
