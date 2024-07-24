import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../services/authentication.service';
import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { Gender } from '@modules/user/dto/user.dto';

describe('Authentication Service', () => {
  let authenticationService: AuthenticationService;
  let userAccountModel: UserAccountModel;
  let passwordServiceHelper :PasswordServiceHelper
  const mockReturnedUser  = {
    personalInformation: {
      firstName: 'oussama',
      lastName: 'benkemchi',
      gender: Gender.MALE,
      dateOfBirth: '22-44-1995',
    },
    contactInformation: {
      address: 'Algeria',
      phone: '2135555555555',
      email: 'admin@dynsight.fr',
    },
    permissions: {
      role: 'Admin'
    },
    
  };
  let mockUserAccountModel = {
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockReturnedUser),
    }),
  };


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        PasswordServiceHelper,
        {
          provide: getModelToken(UserAccount.name),
          useValue: mockUserAccountModel,
        },
      ],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    userAccountModel = module.get<UserAccountModel>(
      getModelToken(UserAccount.name),
    );
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });

  describe('fineOne', () => {
    it("should throw error if couldn't fetch user for any reason", async () => {
      let email = 'test@test.com';
      const mockError = new Error('Database error');

      mockUserAccountModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockRejectedValueOnce(mockError),
      });

      try {
        await authenticationService.findOne(email);
      } catch (error) {
        //expect(authenticationService.findOne(email)).rejects.toThrow(InternalServerErrorException)
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual("Erreur lors de la récupération des données utilisateur")
      }
      
    });
    it('should return user by id', async () => {
      let email = 'test@test.com';
      let userAccountModelFindOne = jest.spyOn(userAccountModel, 'findOne');

      let user = await authenticationService.findOne(email);
      expect(user).toBeDefined();
      expect(userAccountModel.findOne).toHaveBeenCalledWith({
        'authentication.username': email,
      });
    });
  });
});
