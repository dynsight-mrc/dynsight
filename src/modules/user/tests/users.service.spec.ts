import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserServiceHelper } from '../services/user-helper.service';
import { UserAccount, UserAccountModel } from '../models/user.model';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

describe('UserService', () => {
  let userService: UserService;
  let userModel: UserAccountModel;
  let mockOrganizationId = new mongoose.Types.ObjectId(
    '668e8c274bf69a2e53bf59f1',
  );
  let mockBuildingId = new mongoose.Types.ObjectId('668e8c274bf69a2e53bf59f2');
  let mockUserId = '668e8c274bf69a2e53bf59f2';
  let mockUserData = {
    personalInformation: { firstName: 'user 1', lastName: 'last name 1' },
    contactInformation: { email: 'email@dynsight.com' },
    authentication: { username: 'email@dynsight.com', password: 'password' },
    permissions: {
      role: 'organization-owner',
      organizationId: mockOrganizationId,
      buildingId: mockBuildingId,
    },
    profileInformation: undefined,
    preferences: undefined,
  };
 let mockUserServiceHelper = {
    formatUsersRawData: jest.fn().mockReturnValue(mockUserData),
  };
  let mockUserModel = {
    insertMany: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    populate: jest.fn(),
  };

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
  it('should throw error if could not execute findOne', async () => {
    mockUserModel.findOne.mockRejectedValueOnce(Error);
    try {
      let user = await userService.findOneById(mockUserId);
    } catch (error) {
      expect(error.message).toEqual(
        'Error occured while retrieving the user data',
      );
    }
  });
  it('should return null if user not found', async () => {
    mockUserModel.findOne.mockResolvedValueOnce(null);
    let user = await userService.findOneById(mockUserId);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(user).toBeNull();
  });
  it('should return a user if found', async () => {
    mockUserModel.findOne.mockResolvedValueOnce({
      toJSON: () => mockUserData,
    });
    let user = await userService.findOneById(mockUserId);
    
      expect(user).toEqual({
        personalInformation: {
          firstName: expect.any(String),
          lastName: expect.any(String),
        },
        contactInformation: { email: expect.any(String) },
        authentication: {
          username: expect.any(String),
          password: expect.any(String),
        },
        permissions: {
          role: expect.any(String),
          organizationId: expect.any(mongoose.Types.ObjectId),
          buildingId: expect.any(mongoose.Types.ObjectId),
        },
        profileInformation:user?.profileInformation? expect.anything():undefined,
        preferences: user?.preferences? expect.anything(): undefined,
      });
    
   
  });
});
