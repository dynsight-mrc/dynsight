import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReadUserOverview, UpdateUserDto } from '../dto/update-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Types } from 'mongoose';
import { UserServiceHelper } from './user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReadUserDto } from '../dto/read-user.dto';
import { UserRoleMap } from '../dto/user.dto';

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
  ): Promise<ReadUserDto[]> {
    let usersFormatedData = await this.userServiceHelper.formatUsersRawData(
      createUsersDto,
      buildingId,
      organizationId,
    );

    try {
      let usersDocs = await this.userModel.insertMany(usersFormatedData, {
        session,
      });

      return usersDocs as undefined as ReadUserDto[];
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

  async findAllOverview(): Promise<ReadUserOverview[]> {
    let usersDocs: UserAccount[];
    try {
      usersDocs = await this.userModel.find().populate({
        path: 'permissions.organizationId',
        select: ['id', 'name'],
      });
    } catch (error) {
      throw new Error('');
    }
    console.log(usersDocs[0].permissions);
    
    let users: ReadUserOverview[] = usersDocs
      .map((user) => user.toJSON())
      .filter(user=>user.permissions.role!=="admin")
      .map((user) => ({
        id:user.id,
        firstName: user.personalInformation.firstName,
        lastName: user.personalInformation.lastName,
        email: user.contactInformation.email,
        role: UserRoleMap[user.permissions.role],
        organization: user.permissions.organizationId?.name,
      }));
    
    return users;
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
