import { Injectable } from '@nestjs/common';
import {
  CreateUserDocumentAttrsDto,
  CreateUsersAttrsDto,
} from '../dto/user/create-user.dto';
import { PasswordServiceHelper } from './password-helper.service';
import mongoose from 'mongoose';
import { ReadUserDocumentDto } from '../dto/user/read-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { FunctionSharedService } from './functions.shared.service';

@Injectable()
export class UserSharedService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
    private readonly passwordServiceHelper: PasswordServiceHelper,
    private readonly functionSharedService: FunctionSharedService,
  ) {}

  // users data are send with the form of (object of arrays) {firstName:[],lastName[],password:[], role:[]}
  // we need to construct an object for each + adding organizationId and buildingID {firstName,lastName,pasword,email,role,buildingId,organizarionId}
  async formatUsersRawData(
    createUsersDto: CreateUsersAttrsDto,
    buildingId: string,
    organizationId: string,
  ): Promise<CreateUserDocumentAttrsDto[]> {
    let { firstName, lastName, password, email, role } = createUsersDto;
    
    //need to ensure all arrays are equal in length, to be able to extract data by index later
    if (!this.functionSharedService.checkAllObjectFieldsHasSameLength(createUsersDto as undefined as Record<string,string[]>)) {
      throw new Error('Inadéquation des valeurs des utilisateurs');
    }

    //need to ensure there is no double emails (users)
    if (Array.from(new Set(email)).length !== email.length) {
      throw new Error('Emails doivent etre uniques');
    }

    /*  let hashedPasswordArray = await Promise.all(
      password.map(this.passwordServiceHelper.createPasswordHash),
    ); */
    let hashedPasswordArray = await this.functionSharedService.mapAsync(
      password,
      this.passwordServiceHelper.createPasswordHash,
    );

    return email.map((ele, index) => ({
      personalInformation: {
        firstName: firstName[index],
        lastName: lastName[index],
      },
      contactInformation: { email: ele },
      authentication: {
        username: ele,
        password: hashedPasswordArray[index],
      },
      permissions: {
        role: role[index],
        organizationId: new mongoose.Types.ObjectId(organizationId),
        buildingId: new mongoose.Types.ObjectId(buildingId),
      },
    }));
  }

  

  async createMany(
    createUsersDto: CreateUsersAttrsDto,
    buildingId: string,
    organizationId: string,
    session?: any,
  ): Promise<ReadUserDocumentDto[]> {
    let usersFormatedData;

    try {
      usersFormatedData = await this.formatUsersRawData(
        createUsersDto,
        buildingId,
        organizationId,
      );
    } catch (error) {
      throw new Error(
        'Error occured while creating users, Wrong or missing users data',
      );
    }

    try {
      let usersDocs = await this.userModel.insertMany(usersFormatedData, {
        session,
      });

      return usersDocs.map((doc) =>
        doc.toJSON(),
      ) as undefined as ReadUserDocumentDto[];
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User already exists with these details');
      }
      throw new Error('Error occured while creating users');
    }
  }
  async findMany(fields: Record<string, any>): Promise<ReadUserDocumentDto[]> {
    try {
      let users = await this.userModel.find(fields);
      return users.map((user) =>
        user.toJSON(),
      ) as undefined as ReadUserDocumentDto[];
    } catch (error) {
      throw new Error('Error occured while retrieving the users data');
    }
  }
}
