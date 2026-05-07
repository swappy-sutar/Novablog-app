import { HttpStatus } from '@nestjs/common';

export const successResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = HttpStatus.OK,
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
