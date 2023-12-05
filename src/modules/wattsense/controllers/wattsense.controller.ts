import { Controller, Get, Res } from '@nestjs/common';
import { WattsenseService } from '../services/wattsense.service';
import {  firstValueFrom } from 'rxjs';
import { WattsenseDeviceDto } from '../dtos/device/wattsense-device.dto';
import { CreateDeviceDto } from 'src/modules/device/dtos/create-device.dto';
 
@Controller('wattsense')
export class WattsenseController {
  constructor(private readonly wattsenseService: WattsenseService) {}

  @Get('test')
  async _getDevices():Promise<CreateDeviceDto[]> {
    let observableResult = await this.wattsenseService.getDevices();
    return observableResult
  }

  @Get('devices')
  async getDevices() {
    let devices = await this.wattsenseService.getDevicesWithRelatedEntities();
    return devices
  }
}
