import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
interface CustomRequest extends Request {
  token?: string;
}


@Injectable()
export class ExtractToken implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token

      req.token = bearerToken;
      // Next middleware
      return next();
    } else {
      // Forbidden
      return res.status(403).json({
        message: 'Forbidden: Missing or invalid token',
      });
    }
  }
}
