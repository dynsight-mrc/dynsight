import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
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
  

  describe('(GET) /floors?building', () => { 
    it("findByBuildingId: should return a list of floors of specific buildingId",async()=>{
      //create organization
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;

      
      
        let results = await request(app.getHttpServer())
        .get(`/floors?building=${account.building.id}`)
        let floors = results.body   
      
        
        floors.forEach(floor=>{
          expect(floor).toEqual({
            id:expect.any(String),
            name:expect.any(String),
            number:expect.any(Number),
            buildingId:expect.any(String),
            rooms:expect.any(Array)
          })
        })
       
        floors.forEach(floor=>{
          floor.rooms.forEach(room=>{
            expect(room).toEqual({
              id:expect.any(String),
              name:expect.any(String),
              floorId:expect.any(String),
              surface:expect.any(Number),
              type:expect.any(String),
            })
          })
        })
      
    })
   })
});
