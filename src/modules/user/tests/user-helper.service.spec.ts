import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserServiceHelper } from '../services/user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUsersDto } from '../dto/create-users.dto';
import mongoose from 'mongoose';
import { PasswordServiceHelper } from '../services/password-helper.service';

describe('User Service Helper', () => {
  let userServiceHelper: UserServiceHelper;
  let passwordServiceHelper: PasswordServiceHelper;
  let userModel: UserAccountModel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceHelper,
        PasswordServiceHelper,
        { provide: getModelToken(UserAccount.name), useValue: userModel },
      ],
    }).compile();

    userServiceHelper = module.get<UserServiceHelper>(UserServiceHelper);
    userModel = module.get<UserAccountModel>(getModelToken(UserAccount.name));
    passwordServiceHelper = module.get<PasswordServiceHelper>(
      PasswordServiceHelper,
    );
  });

  it('should be defined', () => {
    expect(userServiceHelper).toBeDefined();
  });

  describe('formatUsersRawData', () => {
    it('Throws error if users data re with different sizes', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1'],
        password: ['password'],
        email: ['email@dynsight.com', 'email3@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let organizationId = new mongoose.Types.ObjectId();
      let buildingId = new mongoose.Types.ObjectId();
      expect(() =>
        userServiceHelper.formatUsersRawData(
          createUsersData,
          buildingId,
          organizationId,
        ),
      ).rejects.toThrow('Inadéquation des valeurs des utilisateurs');
    });
    it('Throws error if emails has doubles', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1', 'last name 2'],
        password: ['password', 'password'],
        email: ['email@dynsight.com', 'email@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let organizationId = new mongoose.Types.ObjectId();
      let buildingId = new mongoose.Types.ObjectId();
      expect(() =>
        userServiceHelper.formatUsersRawData(
          createUsersData,
          buildingId,
          organizationId,
        ),
      ).rejects.toThrow('Emails doivent etre uniques');
    });
    it('return a list of formated users data, ready to save to DB', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1', 'last name 2'],
        password: ['password', 'password'],
        email: ['email@dynsight.com', 'email2@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let createHash = jest.spyOn(passwordServiceHelper,"createPasswordHash").mockResolvedValue('hashedPassword')
      let organizationId = new mongoose.Types.ObjectId();
      let buildingId = new mongoose.Types.ObjectId();
      let formatedUsersData =await userServiceHelper.formatUsersRawData(
        createUsersData,
        buildingId,
        organizationId,
      );
      expect(createHash).toHaveBeenCalledTimes(2)  
      
      expect(formatedUsersData).toEqual([
        {
          personalInformation: {
            firstName: createUsersData.firstName[0],
            lastName: createUsersData.lastName[0],
          },
          contactInformation: { email: createUsersData.email[0] },
          authentication: {
            username: createUsersData.email[0],
            password: 'hashedPassword',
          },
          permissions: {
            role: createUsersData.role[0],
            organizationId: organizationId,
            buildingId: buildingId,
          },
          profileInformation: undefined,
          preferences: undefined,
        },
        {
          personalInformation: {
            firstName: createUsersData.firstName[1],
            lastName: createUsersData.lastName[1],
          },
          contactInformation: { email: createUsersData.email[1] },
          authentication: {
            username: createUsersData.email[1],
            password: 'hashedPassword',
          },
          permissions: {
            role: createUsersData.role[1],
            organizationId: organizationId,
            buildingId: buildingId,
          },
          profileInformation: undefined,
          preferences: undefined,
        },
      ]);
    });
  });
});
