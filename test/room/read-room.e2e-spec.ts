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
    it.todo('should return a list of all buildings with ReadRoomOverview[]')
   })
});
