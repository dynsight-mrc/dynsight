import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { WattsenseService } from '../services/wattsense.service';

 
@Controller('wattsense')
export class WattsenseController {
  constructor(private readonly wattsenseService: WattsenseService) {}

  @Get('devices')
  async getDevices() {
    try {
      return await this.wattsenseService.getDevicesWithRelatedEntities();
    } catch (error) {
      
      console.log(error.message);
      
      return new HttpException(error.message,HttpStatus.FORBIDDEN)
      
      
    }
    
  }


}
