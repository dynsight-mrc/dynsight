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
import { UserService } from '@modules/user/services/user.service';

describe('Account (e2e)', () => {
  let app: INestApplication;

  let connection: Connection;
  let replSet: MongoMemoryReplSet;
  let userService: UserService;
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
      consumer.apply(MockExtractToken).forRoutes('users');
    };

    //app.use(["/organizations"],new MockExtractToken().use)
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  it('/(GET) Request to get users overview list ', async () => {
    let req = request(app.getHttpServer());
    let createAccountResponse = await req
      .post('/accounts')
      .send(createAccountPayload);
    let account: ReadAccountDto = createAccountResponse.body;

    await req
      .get('/users/overview')
      .expect(200)
      .then((res) => {
        let users = res.body;
        users.map((user) => {
          expect(user).toEqual({
            id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            role: expect.any(String),
            organization: expect.any(String),
          });
        });
      });
  });

  /* it(' /(GET) Request should throw internalServerErrorException if any error occurs', async () => {
    jest
      .spyOn(userService, 'findAllOverview')
      .mockRejectedValueOnce(new Error(''));
    await request(app.getHttpServer).get('/users/overview').expect(500);
  }); */
});
