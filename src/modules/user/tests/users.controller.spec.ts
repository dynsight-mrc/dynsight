import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { UsersController } from '../controllers/users.controller';
import { UserSharedService } from '@modules/shared/services/user.shared.service';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { Type } from 'class-transformer';

describe('UserController', () => {
  let usersController: UsersController;
  let userSharedService: UserSharedService;
  let requestSharedService: RequestSharedService;

  let mockUserSharedService = {
    findMany: jest.fn(),
  };

  let mockOrganizationId = mongoose.Types.ObjectId.createFromHexString(
    '668e8c274bf69a2e53bf59f1',
  );
  let mockBuildingId = mongoose.Types.ObjectId.createFromHexString(
    '668e8c274bf69a2e53bf59f2',
  );

  let mockUsers = [
    {
      id: mongoose.Types.ObjectId.createFromHexString(
        '668e8c274bf69a2153bf59f1',
      ),
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
    },
    {
      id: mongoose.Types.ObjectId.createFromHexString(
        '668e8c274bf69a2e53bf59f1',
      ),
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
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserSharedService, useValue: mockUserSharedService },
        RequestSharedService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userSharedService = module.get<UserSharedService>(UserSharedService);
    requestSharedService =
      module.get<RequestSharedService>(RequestSharedService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
  describe('find', () => {
    it('should throw InternalServerErrorException if parameters format is incorrect', async () => {
      try {
        await usersController.find(
          '[{"name":"_id","value":"668e8c274bf69a2e53bf59f1"},{"name":"referenceId","value":"6e8c274bf69a2e53bf59f1"}]',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Erreur lors de la récupération des données des utilisateurs, Un ou plusierus parametères sont incorrectes',
        );
      }
    });
    it('should throw InternalServerErrorException if could not retrieve users data', async () => {
      mockUserSharedService.findMany.mockRejectedValueOnce(Error);

      try {
        await usersController.find(
          '[{"name":"_id","value":"668e8c274bf69a2e53bf59f1"},{"name":"referenceId","value":"668e8c274bf69a2e53bf59f1"}]',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Erreur lors de la récupération des données des utilisateurs',
        );
      }
    });

    it('should return a list of users,', async () => {
      mockUserSharedService.findMany.mockResolvedValueOnce(mockUsers);

      let users = await usersController.find(
        '[{"name":"permissions.organizationId","value":"668e8c274bf69a2e53bf59f1"}]',
      );

      expect(users).toBeDefined()
      expect(users.length).toEqual(2)
      users.forEach(user=> expect(user).toEqual({
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
          organizationId: Types.ObjectId.createFromHexString('668e8c274bf69a2e53bf59f1'),
          buildingId: expect.any(mongoose.Types.ObjectId),
        },
        profileInformation:user?.profileInformation? expect.anything():undefined,
        preferences: user?.preferences? expect.anything(): undefined,
      }))
    });
  });

  });
