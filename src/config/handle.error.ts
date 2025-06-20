import { Response } from 'express';
import { CustomError } from '../utils/customError';

export const handleError = (error: unknown, res: Response) => {
  console.error(error);
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    typeof (error as any).statusCode === 'number' &&
    typeof (error as any).message === 'string'
  ) {
    return res.status((error as any).statusCode).json({
      status: 'error ❌',
      message: (error as any).message,
    });
  }

  return res.status(500).json({
    status: 'fail 🧨',
    message: 'Something went very wrong! Please try again later.',
  });
};
