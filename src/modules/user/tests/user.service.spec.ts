import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserServiceHelper } from '../services/user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateUsersDto } from '../dto/create-users.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userModel: UserAccountModel;
  let mockOrganizationId = new mongoose.Types.ObjectId(
    '668e8c274bf69a2e53bf59f1',
  );
  let mockBuildingId = new mongoose.Types.ObjectId('668e8c274bf69a2e53bf59f2');

  let mockFormtedUsersData = [
    {
      personalInformation: { firstName: 'user 1', lastName: 'last name 1' },
      contactInformation: { email: 'email@dynsight.com' },
      authentication: { username: 'email@dynsight.com', password: 'password' },
      permissions: {
        role: 'OO',
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
      },
      profileInformation: undefined,
      preferences: undefined,
    },
    {
      personalInformation: { firstName: 'user 2', lastName: 'last name 2' },
      contactInformation: { email: 'email2@dynsight.com' },
      authentication: { username: 'email2@dynsight.com', password: 'password' },
      permissions: {
        role: 'FM',
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
      },
      profileInformation: undefined,
      preferences: undefined,
    },
  ];
  let mockUserServiceHelper = {
    formatUsersRawData: jest.fn().mockReturnValue(mockFormtedUsersData),
  };
  let mockUserModel = { insertMany: jest.fn() };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserServiceHelper, useValue: mockUserServiceHelper },
        { provide: getModelToken(UserAccount.name), useValue: mockUserModel },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<UserAccountModel>(getModelToken(UserAccount.name));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Create Many', () => {
    it('should throw error if user with one of the provided emails already exists', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1', 'last name 2'],
        password: ['password', 'password'],
        email: ['email@dynsight.com', 'email2@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let session = {};

      jest.spyOn(userModel, 'insertMany').mockRejectedValue({ code: 11000 });

      try {
        await userService.createMany(
          createUsersData,
          mockBuildingId,
          mockOrganizationId,
          session,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual("Un utilisateur existent déja avec ces paramètres");
      }
      expect(mockUserModel.insertMany).toHaveBeenCalledWith(mockFormtedUsersData,{session})
    });
    it('should throw error if if users couldn\'t be inserted for any reason', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1', 'last name 2'],
        password: ['password', 'password'],
        email: ['email@dynsight.com', 'email2@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let session = {};

      jest.spyOn(userModel, 'insertMany').mockRejectedValue({ code: 500 });

      try {
        await userService.createMany(
          createUsersData,
          mockBuildingId,
          mockOrganizationId,
          session,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual("Erreur lors de la création des utilisateurs");
      }
      expect(mockUserModel.insertMany).toHaveBeenCalledWith(mockFormtedUsersData,{session})
    });
    it('should create many users', async () => {
      let createUsersData: CreateUsersDto = {
        firstName: ['user 1', 'user 2'],
        lastName: ['last name 1', 'last name 2'],
        password: ['password', 'password'],
        email: ['email@dynsight.com', 'email2@dynsight.com'],
        role: ['organization-owner', 'facility-manager'],
      };
      let session = {};
      let mockReturnedValue = mockFormtedUsersData.map((ele) => ({
        id: new mongoose.Types.ObjectId(),
        ...ele,
      }));
      jest.spyOn(userModel, 'insertMany').mockResolvedValue(
        //@ts-ignore
        mockReturnedValue,
      );

      let users = await userService.createMany(
        createUsersData,
        mockBuildingId,
        mockOrganizationId,
        session,
      );
      expect(users).toEqual(mockReturnedValue);
    });
  });
});
