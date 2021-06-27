import { Request, Response } from 'express';

export const validationErrorHandler = (
  err: Error,
  _: Request,
  res: Response
) => {
  res.status(400).json({
    error: 'Bad request body',
    message: err.message,
  });
  console.error(err);
};
