import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

describe('Authentication Signin ', () => {
  let authenticationController: AuthenticationController;
  let authenticationService: AuthenticationService;
  let passwordServiceHelper: PasswordServiceHelper;
  let mockAuthenticationSerice = {
    findOne: jest.fn(),
  };
  let mockPasswordServiceHelper = {
    checkPasswordHash: jest.fn(),
  };
  let mockUserCredentials = {
    username: 'test@test.com',
    password: 'test@test.com',
  };
  const mockReturnedUser = {
    personalInformation: {
      firstName: 'oussama',
      lastName: 'benkemchi',
      gender: 'Male',
      dateOfBirth: '22-44-1904',
    },
    contactInformation: {
      address: 'Algeria',
      phone: '2135555555555',
      email: 'admin@dynsight.fr',
    },
    permissions: {
      role: 'admin',
      organization: 'string',
    },
    authentication: {
      username: 'test@test.com',
      password: 'test@test.com',
    },
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationSerice },
        { provide: PasswordServiceHelper, useValue: mockPasswordServiceHelper },
      ],
    }).compile();
    authenticationController = module.get<AuthenticationController>(
      AuthenticationController,
    );
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    passwordServiceHelper = module.get<PasswordServiceHelper>(
      PasswordServiceHelper,
    );
  });
  it('should be defined', () => {
    expect(authenticationController).toBeDefined();
  });

  describe('Signin', () => {
    it('should throw error if the user not exists', async () => {
      mockAuthenticationSerice.findOne.mockResolvedValueOnce(null);
      try {
        await authenticationController.signin(mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Utilisateur non trouvé');
      }

      expect(authenticationService.findOne).toHaveBeenCalledWith(
        mockUserCredentials.password,
      );
    });
    it('should throw error if the password is invalid', async () => {
      mockAuthenticationSerice.findOne.mockResolvedValueOnce(mockReturnedUser);

      let spyCheckPasswordHash = jest
        .spyOn(mockPasswordServiceHelper, 'checkPasswordHash')
        .mockResolvedValueOnce(false);

      try {
        await authenticationController.signin(mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Mauvais mot de passe');
      }

      expect(authenticationService.findOne).toHaveBeenCalledWith(
        mockUserCredentials.username,
      );
      expect(spyCheckPasswordHash).toHaveBeenCalledWith(
        mockUserCredentials.password,
        mockReturnedUser.authentication.password,
      );
    });
    it('should return a valid object with token and user data', async () => {
      mockAuthenticationSerice.findOne.mockResolvedValueOnce(mockReturnedUser);

      let spyCheckPasswordHash = jest
        .spyOn(mockPasswordServiceHelper, 'checkPasswordHash')
        .mockResolvedValueOnce(true);
      let mockedToken = 'signed-jwt-token';

      let spyJWTSign = jest.spyOn(jwt,"sign").mockImplementationOnce(()=>mockedToken);

      let user = await authenticationController.signin(mockUserCredentials);

      expect(authenticationService.findOne).toHaveBeenCalledWith(
        mockUserCredentials.username,
      );
      expect(spyCheckPasswordHash).toHaveBeenCalledWith(
        mockUserCredentials.password,
        mockReturnedUser.authentication.password,
      );
      expect(spyJWTSign).toHaveBeenCalled();
      expect(user.token).toBeDefined();

      spyJWTSign.mockRestore;
    });
  });
});
