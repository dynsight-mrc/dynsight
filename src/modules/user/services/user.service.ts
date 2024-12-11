import { Injectable } from '@nestjs/common';
import { UserServiceHelper } from './user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
  ) {}

  async findOneById(id: string): Promise<ReadUserDocumentDto> {
    try {
      let userDoc = await this.userModel.findOne({ _id: id });
      if (userDoc) return userDoc.toJSON();
      return null;
    } catch (error) {
      throw new Error('Error occured while retrieving the user data');
    }
  }
}
