import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../services/account.service';
import { OrganizationService } from '@modules/organization/services/organization.service';
import { BuildingService } from '@modules/building/services/building.service';
import { FloorService } from '@modules/floor/services/floor.service';
import { RoomService } from '@modules/room/services/room.service';
import { UserService } from '@modules/user/services/user.service';
import mongoose, { Connection, connection, mongo } from 'mongoose';
import { MongodbModule } from '../../../common/databaseConnections/mongodb.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { CreateAccountDto } from '../dto/create-account.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AccountService', () => {
  let accoutService: AccountService;
  let mockOrganizationService = {
    create: jest.fn().mockResolvedValue({
      id: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      reference: 'MINE pro max',
      name: 'MINE pro max pkus ',
      description: 'MINE',
      owner: 'MINE',
    }),
  };
  let mockBuildingService = {
    create: jest.fn().mockResolvedValue({
      id: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      reference: 'building mine pro',
      name: 'building mine pro',
      constructionYear: 2003,
      surface: 250,
      address: {
        streetAddress: '123 Main St',
        streetNumber: '123',
        streetName: 'Main St',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75001',
        country: 'France',
        coordinates: {
          lat: 123,
          long: 3344,
        },
      },
      type: 'industry',
    }),
  };
  let mockFloorService = {
    createMany: jest.fn().mockResolvedValue([
      {
        id: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
        number: 1,
        name: 'etage 1',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
      {
        id: new mongoose.Types.ObjectId('668e6f6250c10dd49808dc5a'),
        number: 2,
        name: 'etage 2',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
      {
        id: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
        number: 3,
        name: 'etage 3',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
    ]),
  };
  let mockRoomService = {
    createMany: jest.fn().mockResolvedValue([
      {
        name: 'bloc 1',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
        floorId: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
        surface: 200,
        type: 'office',
      },
      {
        name: 'bloc 2',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
        floorId: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
        surface: 400,
        type: 'storage',
      },
    ]),
  };
  let mockUserService = {
    createMany: jest.fn().mockResolvedValue([
      {
        id: new mongoose.Types.ObjectId('668fc03580882d6c01ff4790'),
        personalInformation: { firstName: 'user 1', lastName: 'lastname 1' },
        contactInformation: { email: 'email@dynsight.fr' },
        authentication: { username: 'email@dynsight.fr', password: 'password' },
        permissions: {
          role: 'OO',
          organizationId: new mongoose.Types.ObjectId(
            '668e6e2ddb4c17164be2d6a1',
          ),
          buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
        },
        profileInformation: undefined,
        preferences: undefined,
      },
    ]),
  };
  let createAccountDto: CreateAccountDto = {
    building: {
      reference: 'building mine pro',
      name: 'building mine pro',
      constructionYear: 2003,
      surface: 250,
      type: 'commercial',
    },
    floors: {
      name: ['etage 1', 'etage 2', 'etage 3'],
      number: [1, 2, 3],
    },
    blocs: {
      name: ['bloc 1', 'bloc 2'],
      type: ['office', 'storage'],
      surface: [200, 400],
      floors: ['etage 1', 'etage 3'],
    },
    users: {
      firstName: ['user 1'],
      lastName: ['lastname 1'],
      email: ['email@dynsight.fr'],
      password: ['password'],
      role: ['organization-owner'],
    },
    organization: {
      reference: 'MINE pro max',
      name: 'MINE pro max pkus ',
      description: 'MINE',
      owner: 'MINE',
    },
    location: {
      streetAddress: '123 MINE LOCATION',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: 75001,
      country: 'France',
      coordinates: {
        lat: 123,
        long: 3344,
      },
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        AccountService,
        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: FloorService, useValue: mockFloorService },
        { provide: RoomService, useValue: mockRoomService },
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideProvider(getConnectionToken)
      .useValue({})
      .compile();

    accoutService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(accoutService).toBeDefined();
  });

  describe('Create account - organization error handling', () => {
    it('should throw error if an organization is already exist with the same credentials', async () => {
      mockOrganizationService.create.mockRejectedValueOnce({
        code: 409,
        message: 'Organisation existe déja avec ces paramètres',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Organisation existe déja avec ces paramètres`,
        );
      }
    });
    it('should throw error if could not create an organization for any reason', async () => {
      mockOrganizationService.create.mockRejectedValueOnce({
        code: 500,
        message: "Erreur lors de la création du l'organisation",
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Erreur lors de la création du l'organisation ,veuillez réessayer !`,
        );
      }
    });
  });
  describe('Create account - building error handling', () => {
    it('should throw error if a building already exist with the same credentials (organizationId-name)', async () => {
      mockBuildingService.create.mockRejectedValueOnce({
        code: 409,
        message: 'Immeuble existe déja avec ces paramètres',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Immeuble existe déja avec ces paramètres`,
        );
      }
    });
    it('should throw error if could not create an BUILDING for any reason', async () => {
      mockOrganizationService.create.mockRejectedValueOnce({
        code: 500,
        message: "Erreur lors de la création de l'immeuble",
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Erreur lors de la création de l'immeuble ,veuillez réessayer !`,
        );
      }
    });
  });

  describe('Create account - floors error handling', () => {
    it('should throw error if a floor/(s) already exist(s) with the same credentials (organizationId-buildingId-number-name)', async () => {
      mockFloorService.createMany.mockRejectedValueOnce({
        code: 409,
        message: 'Un ou plusieurs étages existent déja avec ces paramètres',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Un ou plusieurs étages existent déja avec ces paramètres`,
        );
      }
    });
    it('should throw error if could not create FLOORS for any reason', async () => {
      mockFloorService.createMany.mockRejectedValueOnce({
        code: 500,
        message: 'Erreur lors de la création des étages',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Erreur lors de la création des étages ,veuillez réessayer !`,
        );
      }
    });
  });

  describe('Create account - blocs error handling', () => {
    it('should throw error if a bloc/(s) already exist(s) with the same credentials (buildingId-name)', async () => {
      mockRoomService.createMany.mockRejectedValueOnce({
        code: 409,
        message: 'Un ou plusieurs blocs existent déja avec ces paramètres',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Un ou plusieurs blocs existent déja avec ces paramètres`,
        );
      }
    });
    it('should throw error if could not create BLOCS for any reason', async () => {
      mockRoomService.createMany.mockRejectedValueOnce({
        code: 500,
        message: 'Erreur lors de la création des blocs',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Erreur lors de la création des blocs ,veuillez réessayer !`,
        );
      }
    });
  });
  describe('Create account - users error handling', () => {
    it('should throw error if a user/(s) already exist(s) with the same credentials (email)', async () => {
      mockUserService.createMany.mockRejectedValueOnce({
        code: 409,
        message: 'Un utilisateur existent déja avec ces paramètres',
      });

      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Un utilisateur existent déja avec ces paramètres`,
        );
      }
    });
    it('should throw error if could not create User for any reason', async () => {
      mockUserService.createMany.mockRejectedValueOnce({
        code: 500,
        message: 'Erreur lors de la création des utilisateurs',
      });
      try {
        await accoutService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual(
          `Erreur s'est produite lors de la création du compte, Erreur lors de la création des utilisateurs ,veuillez réessayer !`,
        );
      }
    });
  });

  it('should create an account and return an object of the created entities', async () => {
    let account = await accoutService.create(createAccountDto);
    expect(account).toBeDefined();
    expect(account.building.organizationId).toEqual(account.organization.id);
    account.floors.forEach((floor) => {
      expect(floor.organizationId).toEqual(account.organization.id);
    });
    account.blocs.forEach((bloc, index) => {
      expect(bloc.organizationId).toEqual(account.organization.id);
      expect(bloc.buildingId).toEqual(account.building.id);
      let floorName = createAccountDto.blocs.floors.find(
        (_, indexFloor) => index === indexFloor,
      );

      let floor = account.floors.find((floor) => floor.name === floorName);

      expect(bloc.floorId).toEqual(floor.id);
    });
    account.users.forEach(user=>{
      expect(user.permissions.organizationId).toEqual(account.organization.id)
      expect(user.permissions.buildingId).toEqual(account.building.id)
    })
    // expect(mockOrganizationService.create).toHaveBeenCalledWith(createAccountDto.organization)
    //expect(accoutService.create).toHaveBeenCalledWith(createAccountDto);
  });
});
