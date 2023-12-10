import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { WattsenseService } from '../services/wattsense.service';
import {  firstValueFrom } from 'rxjs';
import { WattsenseDeviceDto } from '../dtos/device/wattsense-device.dto';
import { CreateDeviceDto } from 'src/modules/device/dtos/create-device.dto';
 
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
