import { NextFunction, Request, Response } from 'express';

function healthcheck(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({ status: 'success' });
}

export default healthcheck;