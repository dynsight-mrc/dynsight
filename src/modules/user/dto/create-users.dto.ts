import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { UserRole } from './user.dto';

import { Type } from 'class-transformer';
import * as UserDtos from './user.dto';
import { Types } from 'mongoose';


