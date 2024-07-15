import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.code === 11000) {
        
        throw new HttpException(
          'Une ressource avec ces détails existe déjà.',
          HttpStatus.CONFLICT,
        );
      /* response.status(409).json({
        statusCode: 409,
        message: 'Erreur: Une ressource avec ces détails existe déjà.',
        timestamp: new Date().toISOString(),
        path: request.url,
      }); */
    } else {
        throw new InternalServerErrorException(
            'Erreur interne du serveur',
          );
      response.status(500).json({
        statusCode: 500,
        message: 'Erreur interne du serveur',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
