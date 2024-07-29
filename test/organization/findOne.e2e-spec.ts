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
  describe('findOne /(GET) Request to get organization by id', () => {
    it('should return an organization (with related entities)', async () => {
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;

      await request(app.getHttpServer())
        .get(`/organizations/${account.organization.id}`)
        .then((res) => {
          let organization: ReadOrganizationWithDetailedBuildingsList =
            res.body;

          expect(organization).toBeDefined();
          expect(organization.buildings[0].floors.length).toEqual(
            account.floors.length,
          );
        });
    });
  });
  describe('overview /(GET) Request to get  all organizations (overview: necessary attributes)', () => {
    it('should return a list of organizations (with related entities)', async () => {
      let createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send(createAccountPayload)
        .withCredentials();
      let account: ReadAccountDto = createAccountResponse.body;

      await request(app.getHttpServer())
        .get(`/organizations/overview`)
        .then((res) => {
          let organizations: ReadOrganizationOverviewDto[] = res.body;
          
          expect(organizations).toBeDefined();
          expect(organizations.length).toEqual(1);
          expect(organizations[0].numberOfBuildings).toBe(1)
        });
    });
  });
});
