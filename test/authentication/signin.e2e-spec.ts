import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from '../__mock__/app-test.module';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

describe('Authentication Signin (e2e)', () => {
  let app: INestApplication;
  let mockUserCredentials = {
    username: 'email@dynsight.com',
    password: 'test@test.com',
  };
  let createUserDto: CreateUserDto = {
    personalInformation: {
      firstName: 'user 1',
      lastName: 'last name 1',
    },
    contactInformation: {
      email: 'email@dynsight.com',
    },
    authentication: {
      username: 'email@dynsight.com',
      password: 'email@dynsight.com',
    },
    permissions: {
      role: 'organization-owner',
      organizationId: new mongoose.Types.ObjectId('6695701b4a5c208180bcfb0b'),
      buildingId: new mongoose.Types.ObjectId('6695701b4a5c208180bcfb0a'),
    },
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
  beforeEach(async () => {
    // Drop all collections before each test
    const collections = await connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
  });
  describe('Authenticatin /(POST) Request to signin', () => {
    it('should throw error if user desnt exist ', async () => {
      let response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockUserCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Utilisateur non trouvé');
    });
    it('should throw error if user password is wrong ', async () => {
      let user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto);

      let response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockUserCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Mauvais mot de passe');
    });

    it('should return a valid object with token ', async () => {
      let user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto);
      
      let response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: createUserDto.authentication.username,
          password: createUserDto.authentication.password,
        });
      expect(response.body.token).toBeDefined()
    });
  });
});
