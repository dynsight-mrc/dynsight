import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { Connection, Types } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';
import { ReadAccountDto } from '@modules/account/dto/read-account.dto';
import { createAccountPayload } from '../__mock__/MockCreateAccountPayload';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { MockGuard } from '../__mock__/mockGuard';
import { MockExtractToken } from '../__mock__/mockExtractTokenMiddleware';
import { CreateBuildingWithRelatedEntities } from '@modules/building/dtos/create-building.dto';

jest.useFakeTimers()
describe('Building (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let replSet: MongoMemoryReplSet;
  let createBuildingWithRelatedEntites: CreateBuildingWithRelatedEntities = {
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
  let mockOrganizationId = new mongoose.Types.ObjectId();
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
      consumer.apply(MockExtractToken).forRoutes('buildings');
    };

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

  describe('(POST) /builldings?organization', () => {
    it('should create a building with complete details and return all the created entities, building, floors[],rooms[]', async () => {
      let organization = mockOrganizationId.toString()
      request(app.getHttpServer())
        .post(`/buildings?organization=${organization}`)
        
        .then((res) => {
          let results = res.body;
          console.log(results);
          
         /*  expect(results).toBeDefined();

          expect(results.building).toBeDefined();
          expect(results.building).toEqual({
            id: expect.any(Types.ObjectId),
            reference: expect.any(String),
            name: expect.any(String),
            constructionYear: expect.any(Number),
            surface: expect.any(Number),
            type: expect.any(String),
            address: {
              streetAddress: expect.any(String),
              streetNumber: expect.any(String),
              streetName: expect.any(String),
              city: expect.any(String),
              state: expect.any(String),
              postalCode: expect.any(Number),
              country: expect.any(String),
              coordinates: {
                lat: expect.any(Number),
                long: expect.any(Number),
              },
            },
            organizationId: expect.any(Types.ObjectId),
          });
          expect(results.floors).toBeDefined();
          results.floors.forEach((floor) =>
            expect({
              name: expect.any(String),
              id: expect.any(Types.ObjectId),
              number: expect.any(Number),
              buildingId: expect.any(Types.ObjectId),
            }),
          );
          expect(results.blocs).toBeDefined();
          results.blocs.forEach((bloc) =>
            expect({
              name: expect.any(String),
              floorId: expect.any(Types.ObjectId),
            }),
          );
          expect(results.organization).toBeDefined();
          expect(results.organization).toEqual(expect.any(Types.ObjectId)); */
        }).catch(err=>{
          console.log(err);
          
        });
    });
  });
});
