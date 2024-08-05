import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';
import { ReadAccountDto } from '@modules/account/dto/read-account.dto';
import { createAccountPayload } from '../__mock__/MockCreateAccountPayload';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { MockGuard } from '../__mock__/mockGuard';
import { MockExtractToken } from '../__mock__/mockExtractTokenMiddleware';

describe('Building (e2e)', () => {
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
  describe('(GET) /buildings/:id', () => {
    it('should return an a building (with related entities)', async () => {
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;

      await request(app.getHttpServer())
        .get(`/buildings/${account.building.id.toString()}`)
        .expect(200)
        .then((res) => {
          let building = res.body;
          expect(building).toBeDefined();
          expect(building.floors.length).toEqual(3);
          expect(
            building.floors.map((floor) => floor.rooms).flat().length,
          ).toEqual(2);
          delete building.floors;
          expect(building).toEqual(account.building);
        });
    });
    it.todo('should return error if could not retrieve the building'
    );
  });
  describe('(GET) /buildings?organization', () => {
    it('should return a list of buildings (with related entities)', async () => {
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;

      await request(app.getHttpServer())
        .get(`/buildings?organization=${account.organization.id.toString()}`)
        .expect(200)
        .then((res) => {
          let buildings = res.body;

          expect(buildings.length).toEqual(1);
          delete account.building.organizationId;
         
          expect(buildings[0]).toEqual(account.building);
        });
    });
   
  });
  describe('(GET) /buildings/overview', () => { 
    it.todo('should return a list of all buildings with ReadBuildingOverview[]')
   })
});
