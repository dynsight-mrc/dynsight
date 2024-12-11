import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccount, UserAccountModel } from '../models/user.model';
import mongoose, { Types } from 'mongoose';
import { PasswordServiceHelper } from '../../shared/services/password-helper.service';

@Injectable()
export class UserServiceHelper {
  constructor(

  ) {}


}
