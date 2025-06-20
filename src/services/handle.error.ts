import { Response } from 'express';
import { CustomError } from '../utils/customError';

export const handleError = (error: unknown, res: Response) => {
  console.error(error);
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      status: 'error ❌',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'fail 🧨',
    message: 'Something went very wrong! Please try again later.',
  });
};
