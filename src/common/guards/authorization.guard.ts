import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

const validateRequest = (token: string): boolean => {
  try {
    const results = jwt.verify(token, process.env.JWTSECRET);
    
    if (results) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const {token} = context.switchToHttp().getRequest();
    
    return validateRequest(token);
    
  }
}
