import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';

describe('Authentication Signin (e2e)', () => {
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
    }).compile();

    app = moduleFixture.createNestApplication();

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
  describe('Authenticatin /(POST) Request to signin', () => {
    it.todo("should return a list of organizations (overview/brief)")
    it.todo("should return error if could not retrieve the list of organizations")

  });
});
