import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class UserAuthCredentials {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

class TokenDto {
  token: string;
}

export class UserSingedinDto extends IntersectionType(
  TokenDto,
  ReadUserDocumentDto,
) {}
