import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, MiddlewareConsumer} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateAccountDto } from '@modules/account/dto/create-account.dto';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MockGuard } from './__mock__/mockGuard';
import { MockExtractToken } from './__mock__/mockExtractTokenMiddleware';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppTestModule } from './__mock__/app-test.module';
import { CreatedAccountDto } from '@modules/account/dto/created-account.dto';


describe('Account (e2e)', () => {
  let app: INestApplication;
  let createAccountDto: CreateAccountDto = {
    building: {
      reference: 'building mine pro',
      name: 'building mine pro max',
      constructionYear: 2003,
      surface: 250,
      type: 'commercial',
    },
    floors: {
      name: ['etage 1',"etage 2",'etage 3'],
      number: [1,2, 3],
    },
    blocs: {
      name: ['bloc 1', 'bloc 2'],
      type: ['office', 'storage'],
      surface: [200, 400],
      floors: ['etage 1', 'etage 3'],
    },
    users: {
      firstName: ['user 1'],
      lastName: ['lastname 1'],
      email: ['emailz@dynsight.fr'],
      password: ['password'],
      role: ['OO'],
    },
    organization: {
      reference: 'MINE pro max',
      name: 'MINE pro max',
      description: 'MINE',
      owner: 'MINE',
    },
    location: {
      streetAddress: '123 MINE LOCATION',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: 75001,
      country: 'France',
      coordinates: {
        lat: 123,
        long: 3344,
      },
    },
  };
  let connection:Connection
  let replSet:MongoMemoryReplSet
  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1 },
    });

    const uri = replSet.getUri();
    console.log(uri);
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule,MongooseModule.forRoot(uri)],
    })
    .overrideGuard(AuthorizationGuard)
    .useClass(MockGuard)
    .compile();

    app = moduleFixture.createNestApplication();
    const appModule = app.get(AppTestModule)
    appModule.configure=(consumer)=>{
        consumer.apply(MockExtractToken).forRoutes('accounts', 'organizations', 'rooms')
    }

    //app.use(["/organizations"],new MockExtractToken().use)
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken())
      
  });

    it('/(POST) Request to create new account ', async() => {
     await request(app.getHttpServer())
      .post('/accounts')
      .send(createAccountDto)
      .expect(201)
      .then((res) => {
        let account:CreatedAccountDto = res.body
        expect(account).toBeDefined()
        expect(account.blocs.length).toEqual(2)
        expect(account.floors.length).toEqual(3)
        expect(account.users.length).toEqual(1)
        expect(account.building.organizationId).toEqual(account.organization.id)
        account.floors.forEach(floor=>{
          expect(floor.buildingId).toEqual(account.building.id)
          expect(floor.organizationId).toEqual(account.organization.id)
        })
        account.blocs.forEach((bloc, index) => {
          expect(bloc.organizationId).toEqual(account.organization.id);
          expect(bloc.buildingId).toEqual(account.building.id);
          let floorName = createAccountDto.blocs.floors.find(
            (_, indexFloor) => index === indexFloor,
          );
    
          let floor = account.floors.find((floor) => floor.name === floorName);
    
          expect(bloc.floorId).toEqual(floor.id);
        });
        
      });

     
      return
  });

  

  
});
