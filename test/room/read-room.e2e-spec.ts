import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, Types } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { MockGuard } from '../__mock__/mockGuard';
import { createAccountPayload } from '../__mock__/MockCreateAccountPayload';
import { ReadAccountDto } from '@modules/account/dto/read-account.dto';
import { MockExtractToken } from '../__mock__/mockExtractTokenMiddleware';

describe('Organization (e2e)', () => {
  let app: INestApplication;
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
      consumer.apply(MockExtractToken).forRoutes('rooms');
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
  describe('findAllOverview /(GET) request to get all rooms overview details', () => {
    it('should return a list of all buildings with ReadRoomOverview[]', async () => {
      let req = request(app.getHttpServer());
      let createAccountResponse = await req
        .post('/accounts')
        .send(createAccountPayload);
      let account: ReadAccountDto = createAccountResponse.body;

      await req
        .get('/rooms/overview')
        .expect(200)
        .then((res) => {
          let rooms = res.body;
          rooms.map((room) => {
            expect(room).toEqual({
              name: expect.any(String),
              surface: expect.any(Number),
              type: expect.any(String),
              id: expect.any(String),
              floor: {
                number: expect.any(Number),
                name: expect.any(String),
                id: expect.any(String),
              },
              building: { name: expect.any(String), id: expect.any(String) },
              organization: {
                name: expect.any(String),
                id: expect.any(String),
              },
            });
          });
        });
    });
  });

  describe('(GET) /rooms?building', () => {
    it('findByBuildingId: should return a list of rooms of specific buildingId', async () => {
      let req = request(app.getHttpServer());
      let createAccountResponse = await req
        .post('/accounts')
        .send(createAccountPayload);
      let account: ReadAccountDto = createAccountResponse.body;

      let results = await req.get(`/rooms?building=${account.building.id}`);
      let rooms = results.body;
      rooms.forEach((room) => {
        expect(room).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          floorId: expect.any(String),
          surface: expect.any(Number),
          type:expect.any(String)
        });
      });
    });
  });
});
