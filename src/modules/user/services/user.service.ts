import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Types } from 'mongoose';
import { UserServiceHelper } from './user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
    private readonly userServiceHelper: UserServiceHelper,
  ) {}

  async createMany(
    createUsersDto: CreateUsersDto,
    buildingId: Types.ObjectId,
    organizationId: Types.ObjectId,
    session?: any,
  ): Promise<UserAccount[]> {
    let usersFormatedData = await this.userServiceHelper.formatUsersRawData(
      createUsersDto,
      buildingId,
      organizationId,
    );
      
    try {
      let usersDocs = await this.userModel.insertMany(usersFormatedData,{session});
     
      return usersDocs as undefined as UserAccount[];
    } catch (error) {

      if (error.code === 11000) {
        throw new HttpException(
          'Un utilisateur existent déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création des utilisateurs',
      );
    }
  }
 
 
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
