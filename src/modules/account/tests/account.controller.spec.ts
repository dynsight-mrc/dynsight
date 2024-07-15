import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../controllers/account.controller';
import { AccountService } from '../services/account.service';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import mongoose from 'mongoose';
import { CreateAccountDto } from '../dto/create-account.dto';

describe('AccountController', () => {
  let accountController: AccountController;
  let mockCreatedAccount = {
    organization: {
      id: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      reference: 'MINE pro max',
      name: 'MINE pro max pkus ',
      description: 'MINE',
      owner: 'MINE',
    },
    building: {
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
    },
    floors: [
      {
        id: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
        number: 1,
        name: 'etage 1',
        organizationId: new mongoose.Types.ObjectId(
          '668e6e2ddb4c17164be2d6a1',
        ),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
      {
        id: new mongoose.Types.ObjectId('668e6f6250c10dd49808dc5a'),
        number: 2,
        name: 'etage 2',
        organizationId: new mongoose.Types.ObjectId(
          '668e6e2ddb4c17164be2d6a1',
        ),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
      {
        id: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
        number: 3,
        name: 'etage 3',
        organizationId: new mongoose.Types.ObjectId(
          '668e6e2ddb4c17164be2d6a1',
        ),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
    ],
    blocs: [
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
    ],
    users: [
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
    ],
  }
  let mockAccountService = {
    create: jest.fn().mockResolvedValueOnce(mockCreatedAccount),
  };
  let accountService: AccountService;
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
      role: ['OO'],
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
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: mockAccountService }],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

      accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });
  describe('Create account', () => { 
    it("should return object with all entities of the created account",async()=>{
      let account = await accountService.create(createAccountDto)
      expect(accountService.create).toHaveBeenCalledWith(createAccountDto)
      expect(account).toEqual(mockCreatedAccount)
    })
   })

});
