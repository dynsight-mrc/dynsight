import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReadUserByOrganizationId, ReadUserOverview } from '../dto/read-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import mongoose, { Types } from 'mongoose';
import { UserServiceHelper } from './user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReadUserDto } from '../dto/read-user.dto';
import { UserRoleMap } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
      throw new Error("Erreur s'est produite lors de la récupération des données utilisateurs");
    }
    
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

  async findByOrganizationId(organization:string):Promise<ReadUserByOrganizationId[]>{
    let usersDocs: UserAccount[];
    try {
      usersDocs = await this.userModel.find({'permissions.organizationId':new mongoose.Types.ObjectId(organization)})
      let users: ReadUserByOrganizationId[] = usersDocs
      .map((user) => user.toJSON())
      .filter(user=>user.permissions.role!=="admin")
      .map((user) => ({
        id:user.id,
        firstName: user.personalInformation.firstName,
        lastName: user.personalInformation.lastName,
        email: user.contactInformation.email,
        role: UserRoleMap[user.permissions.role],
      }));
      return users
    } catch (error) {
      throw new Error("Erreur s'est produite lors de la récupération des données utilisateurs");
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
