import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService = {
    findAllOverview: jest.fn(),
  };
  let userService: UserService;
  let mockUser = {
    id: new mongoose.Types.ObjectId(),
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'user@dynsight.fr',
    role: 'company-occupant',
    organization: 'dynsight',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('findAllOverview', () => {
    it('should throw InternalServerErrorException if any error occured', async () => {
      mockUserService.findAllOverview.mockRejectedValueOnce(new Error(''));

      try {
        await userController.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupération des données utilisateurs",
        );
      }
    });

    it('should return a list of users ,owner,', async () => {
      mockUserService.findAllOverview.mockResolvedValueOnce([mockUser]);

      let users = await userController.findAll();
      expect(users.length).toEqual(1)
    });
  });
  afterEach(() => {
    mockUserService.findAllOverview.mockReset();
  });
});
