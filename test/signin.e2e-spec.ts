import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from './__mock__/app-test.module';
import { error } from 'console';

describe('Authentication Signin (e2e)', () => {
  let app: INestApplication;
  let mockUserCredentials = {
    username: 'test@test.com',
    password: 'test@test.com',
  };
  let connection: Connection;

  let replSet: MongoMemoryReplSet;
  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1 },
    });

    const uri = replSet.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule, MongooseModule.forRoot(uri)],
    }).compile();

    app = moduleFixture.createNestApplication();
  
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  describe('Authenticatin /(POST) Request to signin', () => {
    it(' should throw error if user desnt exist ', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockUserCredentials)
        .catch(error=>{
            expect(error).toBeFalsy();
 
        })

      return;
    });
    
  });
});
