import { CanActivate, ExecutionContext, INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {    
    return true;
  }
}
