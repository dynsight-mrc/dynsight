import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,

  IsString,

} from 'class-validator';
import { UserRole } from './user.dto';

export class CreateUsersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  firstName: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })  
  lastName: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  email: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  password: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  role: UserRole[];
}
