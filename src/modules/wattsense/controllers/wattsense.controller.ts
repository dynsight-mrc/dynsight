import { Controller, Get, Res } from '@nestjs/common';
import { WattsenseService } from '../services/wattsense.service';
import {  firstValueFrom } from 'rxjs';
import { ReadDeviceDto } from '../dtos/device/read-device.dto';
 
@Controller('wattsense')
export class WattsenseController {
  constructor(private readonly wattsenseService: WattsenseService) {}

  @Get('test')
  async _getDevices():Promise<ReadDeviceDto[]> {
    let observableResult = await this.wattsenseService.getDevices();
    return observableResult
  }

  @Get('devices')
  async getDevices() {
    let devices = await this.wattsenseService.getDevicesWithRelatedEntities();
    return devices
  }
}
