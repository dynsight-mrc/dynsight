import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService = {
    findAllOverview: jest.fn(),
    findByOrganizationId:jest.fn()
  };
  let userService: UserService;
  let mockOrganizationId = new mongoose.Types.ObjectId()
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
        await userController.findAllOverview();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          "Erreur s'est produite lors de la récupération des données utilisateurs",
        );
      }
    });

    it('should return a list of users ,owner,', async () => {
      mockUserService.findAllOverview.mockResolvedValueOnce([mockUser]);

      let users = await userController.findAllOverview();
      expect(users.length).toEqual(1)
    });
  });

  describe('findByOrganizationId', () => { 
    it.todo("should throw internalServerError if could not retrieve users data for any reason")
    it("should return a list of users of with specific organization id, with the format ReadUserByOrganizationId[]",async()=>{
      let mockUserDoc = mockUser
      delete mockUserDoc.organization  
      mockUserService.findByOrganizationId.mockResolvedValueOnce([mockUserDoc])
      let users = await userController.findByOrganizationId(mockOrganizationId.toString())
      expect(users.length).toEqual(1)
      users.forEach(user=>{
        expect(user).toEqual({
          id: expect.any(Types.ObjectId),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
        });
      })
    })
   })
  afterEach(() => {
    mockUserService.findAllOverview.mockReset();
  });
});
