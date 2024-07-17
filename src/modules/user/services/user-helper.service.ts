import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { CreateUsersDto } from '../dto/create-users.dto';
import mongoose, { Types } from 'mongoose';
import { PasswordServiceHelper } from './password-helper.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserServiceHelper {
  constructor(
    private readonly passwordServiceHelper: PasswordServiceHelper,
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
  ) {}

  checkAllUsersFieldsHasSameLength(usersData: CreateUsersDto) {
    let { firstName, lastName, password, email, role } = usersData;

    return [
      firstName.length,
      lastName.length,
      password.length,
      email.length,
      role.length,
    ]
      .map((val, index, arr) => val === arr[0])
      .reduce((acc, val) => acc && val, true);
  }

  async formatUsersRawData(
    createUsersDto: CreateUsersDto,
    buildingId: Types.ObjectId,
    organizationId: Types.ObjectId,
  ):Promise<CreateUserDto[]>{
    let { firstName, lastName, password, email, role } = createUsersDto;

    if (!this.checkAllUsersFieldsHasSameLength(createUsersDto)) {
      throw new Error('Inadéquation des valeurs des utilisateurs');
    }
    //CHECK IF THERE IS NO DOUBLE NAME VALUES
    if (Array.from(new Set(email)).length !== email.length) {
      throw new Error('Emails doivent etre uniques');
    }
    let hashedPasswordArray = await Promise.all(
      password.map(this.passwordServiceHelper.createPasswordHash),
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
}
