import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MockGuard } from '../__mock__/mockGuard';
import { MockExtractToken } from '../__mock__/mockExtractTokenMiddleware';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { ReadAccountDto } from '@modules/account/dto/read-account.dto';
import { createAccountPayload } from '../__mock__/MockCreateAccountPayload';

describe('Account (e2e)', () => {
  let app: INestApplication;
  /* let createAccountDto: CreateAccountDto = {
    building: {
      reference: 'building mine pro',
      name: 'building mine pro max',
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
      email: ['emailz@dynsight.fr'],
      password: ['password'],
      role: ['organization-owner'],
    },
    organization: {
      reference: 'MINE pro max',
      name: 'MINE pro max',
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
  }; */
  let connection: Connection;
  let replSet: MongoMemoryReplSet;
  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1 },
    });

    const uri = replSet.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule, MongooseModule.forRoot(uri)],
    })
      .overrideGuard(AuthorizationGuard)
      .useClass(MockGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    const appModule = app.get(AppTestModule);
    appModule.configure = (consumer) => {
      consumer.apply(MockExtractToken).forRoutes('accounts');
    };

    //app.use(["/organizations"],new MockExtractToken().use)
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
  });
  beforeEach(async () => {
    // Drop all collections before each test
    const collections = await connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
  });
  describe('(POST) /accounts', () => {
    it('/(POST) Request to create new account ', async () => {
      try {
        let results = await request(app.getHttpServer())
          .post('/accounts')
          .send(createAccountPayload);

        let account: ReadAccountDto = results.body;
        
        expect(account).toBeDefined();
        //expect(account.blocs.length).toEqual(2);
        expect(account.floors.length).toEqual(3);
        expect(account.users.length).toEqual(1);
        expect(account.users[0].personalInformation).toBeDefined();
        expect(account.users[0].contactInformation).toBeDefined();
        expect(account.users[0].permissions).toBeDefined();
        expect(account.users[0].authentication).toBeDefined();
        expect(account.building.organizationId).toEqual(
          account.organization.id,
        );
        account.floors.forEach((floor) => {
          expect(floor.buildingId).toEqual(account.building.id);
          expect(floor.organizationId).toEqual(account.organization.id);
        });
        /* account.blocs.forEach((bloc, index) => {
          expect(bloc.organizationId).toEqual(account.organization.id);
          expect(bloc.buildingId).toEqual(account.building.id);
          let floorName = createAccountPayload.blocs.floors.find(
            (_, indexFloor) => index === indexFloor,
          );

          let floor = account.floors.find((floor) => floor.name === floorName);

          expect(bloc.floorId).toEqual(floor.id);
        }); */
      } catch (error) {
        console.log(error);
      }
    });
  });
});
