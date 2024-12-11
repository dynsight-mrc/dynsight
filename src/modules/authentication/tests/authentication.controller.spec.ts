import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserSharedService } from '@modules/shared/services/user.shared.service';
import { Gender } from '@modules/shared/types/user.type';
import { UserRole } from '@modules/user/dto/enums/user-role.enum';

describe('Authentication Signin ', () => {
  let authenticationController: AuthenticationController;
  let authenticationService: AuthenticationService;
  let passwordServiceHelper: PasswordServiceHelper;
  let userSharedService: UserSharedService;

  let mockUserSharedService = {
    findMany: jest.fn(),
  };
  let mockAuthenticationSerice = {
    findOne: jest.fn(),
    createOne: jest.fn(),
  };
  let mockPasswordServiceHelper = {
    checkPasswordHash: jest.fn(),
    createPasswordHash: jest.fn(),
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

  const mockCreateUserDto = {
    personalInformation: {
      lastName: 'admin',
      firstName: 'admin',
      gender: Gender.MALE,
    },
    contactInformation: {
      email: 'admin@dynsight.fr',
    },
    authentication: {
      username: 'admin@dynsight.fr',
      password: 'admin@dynsight.fr',
    },
    permissions: {
      role: "admin",
    },
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationSerice },
        { provide: UserSharedService, useValue: mockUserSharedService },
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
    userSharedService = module.get<UserSharedService>(UserSharedService);
  });
  it('should be defined', () => {
    expect(authenticationController).toBeDefined();
  });

  describe('Signin', () => {
    it('should throw error if the user not exists', async () => {
      mockUserSharedService.findMany.mockResolvedValueOnce([]);
      try {
        await authenticationController.signin(mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Utilisateur non trouvé');
      }
    });

    it('should throw error if the password is invalid', async () => {
      mockUserSharedService.findMany.mockResolvedValueOnce([mockReturnedUser]);

      let spyCheckPasswordHash = jest
        .spyOn(mockPasswordServiceHelper, 'checkPasswordHash')
        .mockResolvedValueOnce(false);

      try {
        await authenticationController.signin(mockUserCredentials);
      } catch (error) {
        expect(userSharedService.findMany).toHaveBeenCalledWith({
          'authentication.username': mockUserCredentials.username,
        });
        expect(spyCheckPasswordHash).toHaveBeenCalledWith(
          mockUserCredentials.password,
          mockReturnedUser.authentication.password,
        );

        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Mauvais mot de passe');
      }
    });

    it('should return a valid object with token and user data', async () => {
      mockUserSharedService.findMany.mockResolvedValueOnce([mockReturnedUser]);

      let spyCheckPasswordHash = jest
        .spyOn(mockPasswordServiceHelper, 'checkPasswordHash')
        .mockResolvedValueOnce(true);

      let mockedToken = 'signed-jwt-token';

      let spyJWTSign = jest
        .spyOn(jwt, 'sign')
        .mockImplementationOnce(() => mockedToken);

      let user = await authenticationController.signin(mockUserCredentials);

      expect(spyCheckPasswordHash).toHaveBeenCalledWith(
        mockUserCredentials.password,
        mockReturnedUser.authentication.password,
      );
      expect(spyJWTSign).toHaveBeenCalled();
      expect(user.token).toBeDefined();

      spyJWTSign.mockRestore;
    });
  });

  describe('Signin', () => {
    it('should thorw an error if could not create a user', async () => {
      mockAuthenticationSerice.createOne.mockRejectedValue(Error);
      try {
        await authenticationController.signup(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.message).toEqual("Erreur lors de la création du compte")
      }
    });
  });
});
