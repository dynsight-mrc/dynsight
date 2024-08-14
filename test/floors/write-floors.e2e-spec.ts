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
import {
  ReadOrganizationOverviewDto,
  ReadOrganizationWithDetailedBuildingsList,
} from '@modules/organization/dtos/read-organization.dto';

describe('Organization (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let replSet: MongoMemoryReplSet;
  let createFloorsWithRoomsDto = {
    floors: {
      name: ['etage 10', 'etage 12', 'etage 13'],
      number: [10, 12, 13],
    },
    blocs: {
      name: ['bloc 10', 'bloc 12'],
      type: ['office', 'storage'],
      surface: [25, 40],
      floors: ['etage 10', 'etage 13'],
    },
  };
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
      consumer.apply(MockExtractToken).forRoutes('organizations');
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

  describe('(POST) /floors/with-rooms?building', () => {
    it('createManyWithRooms: should return a list of created floors and rooms', async () => {
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;
      let {
        building: { id: buildingId },
      } = account;
      
      let response = await request(app.getHttpServer()).post(
        `/floors/with-rooms?building=${buildingId}`,
      ).send(createFloorsWithRoomsDto);
      let {floors,rooms} = response.body
        console.log(floors[0]);
        console.log(rooms[0]);
        
        
      floors.forEach((floor) => {
        expect(floor).toEqual({
          name: expect.any(String),
          id: expect.any(String),
          number: expect.any(Number),
          buildingId: expect.any(String),
          organizationId: expect.any(String),
          
        });
      });
      rooms.forEach((room) => {
        expect(room).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          floorId: expect.any(String),
          buildingId: expect.any(String),
          organizationId: expect.any(String),
          surface: expect.any(Number),
          type:expect.any(String)
        });
      });
    });
  });
});
