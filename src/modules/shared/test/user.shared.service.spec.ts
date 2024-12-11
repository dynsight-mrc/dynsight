import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserSharedService } from '../services/user.shared.service';
import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { CreateUsersAttrsDto } from '../dto/user/create-user.dto';
import { FunctionSharedService } from '../services/functions.shared.service';

describe('UserService', () => {
  let userSharedService: UserSharedService;
  let userModel: UserAccountModel;
  let functionSharedService: FunctionSharedService;
  let passwordServiceHelper: PasswordServiceHelper;

  let mockUserModel = {
    insertMany: jest.fn(),
    find: jest.fn(),
    populate: jest.fn(),
  };

  let mockOrganizationId = new mongoose.Types.ObjectId(
    '668e8c274bf69a2e53bf59f1',
  );
  let mockBuildingId = new mongoose.Types.ObjectId('668e8c274bf69a2e53bf59f2');
  let mockUserId = new mongoose.Types.ObjectId();

  let mockCreateUsersData: CreateUsersAttrsDto = {
    firstName: ['user 1', 'user 2'],
    lastName: ['last name 1', 'last name 2'],
    password: ['password', 'password'],
    email: ['email@dynsight.com', 'email2@dynsight.com'],
    role: ['organization-owner', 'company-occupant'],
  };
  let mockCreateUsersMissingData: CreateUsersAttrsDto = {
    firstName: ['user 1', 'user 2'],
    lastName: ['last name 1'],
    password: ['password'],
    email: ['email@dynsight.com', 'email3@dynsight.com'],
    role: ['organization-owner', 'facility-manager'],
  };
  let mockFormtedUsersData = [
    {
      personalInformation: { firstName: 'user 1', lastName: 'last name 1' },
      contactInformation: { email: 'email@dynsight.com' },
      authentication: {
        username: 'email@dynsight.com',
        password: 'password-hashed',
      },
      permissions: {
        role: 'organization-owner',
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
      },
      profileInformation: undefined,
      preferences: undefined,
    },
    {
      personalInformation: { firstName: 'user 2', lastName: 'last name 2' },
      contactInformation: { email: 'email2@dynsight.com' },
      authentication: {
        username: 'email2@dynsight.com',
        password: 'password-hashed',
      },
      permissions: {
        role: 'company-occupant',
        organizationId: mockOrganizationId,
        buildingId: mockBuildingId,
      },
      profileInformation: undefined,
      preferences: undefined,
    },
  ];
  let mockUserDoc = mockFormtedUsersData.map((ele) => ({
    toJSON: () => ({
      ...ele,
      id: new mongoose.Types.ObjectId(),
      permissions: {
        ...ele.permissions,
        organizationId: {
          id: ele.permissions.organizationId,
          name: 'dynsight',
        },
      },
    }),
  }));

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSharedService,
        { provide: getModelToken(UserAccount.name), useValue: mockUserModel },
        PasswordServiceHelper,
        FunctionSharedService,
      ],
    }).compile();

    userSharedService = module.get<UserSharedService>(UserSharedService);
    userModel = module.get<UserAccountModel>(getModelToken(UserAccount.name));
    passwordServiceHelper = module.get<PasswordServiceHelper>(
      PasswordServiceHelper,
    );
    functionSharedService = module.get<FunctionSharedService>(
      FunctionSharedService,
    );
  });

  it('should be defined', () => {
    expect(userSharedService).toBeDefined();
  });

  describe('formatUsersRawData', () => {
    it('Throws error if users data re with different sizes', async () => {
      let organizationId = mockOrganizationId.toString();
      let buildingId = mockBuildingId.toString();
      expect(() =>
        userSharedService.formatUsersRawData(
          mockCreateUsersMissingData,
          buildingId,
          organizationId,
        ),
      ).rejects.toThrow('Inadéquation des valeurs des utilisateurs');
    });
    it('Throws error if emails has doubles', async () => {
      let _mockCreateUsersData = { ...mockCreateUsersData };
      _mockCreateUsersData.email[1] = 'email@dynsight.com';

      expect(() =>
        userSharedService.formatUsersRawData(
          _mockCreateUsersData,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
        ),
      ).rejects.toThrow('Emails doivent etre uniques');
    });
    it('return a list of formated users data, ready to save to DB', async () => {
      let _mockCreateUsersData = { ...mockCreateUsersData };
      _mockCreateUsersData.email[1] = 'email3@dynsight.com';

      let createHash = jest
        .spyOn(passwordServiceHelper, 'createPasswordHash')
        .mockResolvedValue('hashedPassword');

      let formatedUsersData = await userSharedService.formatUsersRawData(
        _mockCreateUsersData,
        mockBuildingId.toString(),
        mockOrganizationId.toString(),
      );

      expect(createHash).toHaveBeenCalledTimes(2);

      formatedUsersData.forEach((user) =>
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
            organizationId: expect.any(Types.ObjectId),
            buildingId: expect.any(Types.ObjectId),
          },
          profileInformation: user.profileInformation
            ? expect.anything()
            : undefined,
          preferences: user.preferences ? expect.anything() : undefined,
        }),
      );
    });
  });



  describe('Create Many', () => {
    it('should throw error if if users data are invalid', async () => {
      let session = {};
      try {
        await userSharedService.createMany(
          mockCreateUsersMissingData,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
          session,
        );
      } catch (error) {
        expect(error.message).toEqual(
          'Error occured while creating users, Wrong or missing users data',
        );
      }
    });

    it('should throw error if user with one of the provided emails already exists', async () => {
      let session = {};
      jest
        .spyOn(userSharedService, 'formatUsersRawData')
        .mockResolvedValueOnce(mockFormtedUsersData);
      jest.spyOn(userModel, 'insertMany').mockRejectedValue({ code: 11000 });

      try {
        await userSharedService.createMany(
          mockCreateUsersData,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
          session,
        );
      } catch (error) {
        expect(mockUserModel.insertMany).toHaveBeenCalledWith(
          mockFormtedUsersData,
          { session },
        );
        expect(error.message).toEqual('User already exists with these details');
      }
    });

    it("should throw error if if users couldn't be inserted for any reason", async () => {
      let session = {};
      jest
        .spyOn(userSharedService, 'formatUsersRawData')
        .mockResolvedValueOnce(mockFormtedUsersData);
      jest.spyOn(userModel, 'insertMany').mockRejectedValueOnce({ code: 500 });

      try {
        await userSharedService.createMany(
          mockCreateUsersData,
          mockBuildingId.toString(),
          mockOrganizationId.toString(),
          session,
        );
      } catch (error) {
        expect(mockUserModel.insertMany).toHaveBeenCalledWith(
          mockFormtedUsersData,
          { session },
        );
        expect(error.message).toEqual('Error occured while creating users');
      }
    });

    it('should create many users', async () => {
      let session = {};

      let mockReturnedValue = mockFormtedUsersData.map((ele) => ({
        toJSON: () => ({
          id: new mongoose.Types.ObjectId(),
          ...ele,
        }),
      }));
      jest.spyOn(userModel, 'insertMany').mockResolvedValue(
        //@ts-ignore
        mockReturnedValue,
      );

      let users = await userSharedService.createMany(
        mockCreateUsersData,
        mockBuildingId.toString(),
        mockOrganizationId.toString(),
        session,
      );

      users.forEach((user) =>
        expect(user).toEqual({
          id:expect.any(Types.ObjectId),
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
            organizationId: expect.any(Types.ObjectId),
            buildingId: expect.any(Types.ObjectId),
          },
          profileInformation: user.profileInformation
            ? expect.anything()
            : undefined,
          preferences: user.preferences ? expect.anything() : undefined,
        }),
      );
      expect(users).toBeDefined();
    });
  });

  describe('findMany',()=>{
    it("should throw an error if could not retrieve users data for any reason",async()=>{
        let queryParams = {email:"email@dynsight.com"}
        jest.spyOn(userModel,"find").mockRejectedValueOnce(Error)
        try {
          await userSharedService.findMany(queryParams)
        } catch (error) {
          expect(error.message).toEqual("Error occured while retrieving the users data")
        }
    })
    //it("should return a list of users data by the query params provided")
  })
});
