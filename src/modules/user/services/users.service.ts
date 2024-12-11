import {
  Injectable,
} from '@nestjs/common';

import { UserAccount, UserAccountModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';

import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
  ) {}


  async findAll() {
    let usersDocs: UserAccount[];
    try {
      usersDocs = await this.userModel.find();
    } catch (error) {
      throw new Error('Error occured while retrieving the users data');
    }

    let users = usersDocs.map((roomDoc) =>
      roomDoc.toJSON(),
    ) as undefined as ReadUserDocumentDto[];

    return users;
  }


 
}
