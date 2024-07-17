import { CreateUserDto } from './create-user.dto';
import { IntersectionType } from '@nestjs/mapped-types';

class TokenDto {
  token: string;
}

export class AuthenticatedUserDto extends IntersectionType(
  TokenDto,
  CreateUserDto,
) {}
