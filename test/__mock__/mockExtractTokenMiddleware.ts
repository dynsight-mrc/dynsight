import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
interface CustomRequest extends Request {
  token?: string;
}

@Injectable()
export class MockExtractToken implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    // Next middleware    
    return next();
  }
}
