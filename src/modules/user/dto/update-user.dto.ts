import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export type ReadUserOverview = {
    id:Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
};
