import { Test, TestingModule } from '@nestjs/testing';
import { WattsenseService } from '../services/wattsense.service';
import { WattsenseApiAuthenticator } from '../services/helper/wattsense-api-authentication.service';
import { WattsenseApiHelper } from '../services/helper/wattsense-api-helper.service';
import { HttpModule } from '@nestjs/axios';
import { Connection } from 'mongoose';

describe('WattsenseService', () => {
  let service: WattsenseService;
  enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
  }
    

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [WattsenseService,  WattsenseApiHelper,
        {
          useFactory: (): WattsenseApiAuthenticator => {
            return new WattsenseApiAuthenticator(
              HttpMethods.GET,
              process.env.API_SECRET,
              process.env.API_KEY,
              
            );
          },
          provide: 'WATTSENSE_GET_API',
        },
     ],
    }).compile();

    service = module.get<WattsenseService>(WattsenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
