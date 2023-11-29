import { Module } from '@nestjs/common';
import { WattsenseController } from './controllers/wattsense.controller';
import { WattsenseService } from './services/wattsense.service';
import { HttpModule } from '@nestjs/axios';
import { WattsenseApiAuthenticator } from './services/wattsense-api-authentication.service';
import { WattsenseApiHelper } from './services/wattsense-api-helper.service';
enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}
type WattsenseApiConfig = {
  method: HttpMethods.GET;
  relativePath: '/v1/devices';
};

@Module({
  imports: [HttpModule],
  controllers: [WattsenseController],
  providers: [
    WattsenseService,
    WattsenseApiHelper,
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
})
export class WattsenseModule {}
