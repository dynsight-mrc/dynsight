import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import mongoose, { Types } from 'mongoose';
import { UserServiceHelper } from './user-helper.service';
import { User, UserModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    private readonly userServiceHelper: UserServiceHelper,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  async createMany(
    createUsersDto: CreateUsersDto,
    buildingId: Types.ObjectId,
    organizationId: Types.ObjectId,
    session: any,
  ) :Promise<User[]>{
    let usersFormatedData = this.userServiceHelper.formatUsersRawData(
      createUsersDto,
      buildingId,
      organizationId,
    );
      
    try {
      let usersDocs = await this.userModel.insertMany(usersFormatedData,{session});
      return usersDocs
    } catch (error) {
      console.log(error);
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
