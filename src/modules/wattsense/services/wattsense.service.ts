import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Observable, firstValueFrom, forkJoin } from 'rxjs';
import { WattsenseApiAuthenticator } from './wattsense-api-authentication.service';
import { WattsenseApiHelper } from './wattsense-api-helper.service';
import { WattsenseDeviceDto } from '../dtos/device/wattsense-device.dto';
import { WattsenseDeviceConfigDto } from '../dtos/device/wattsense-device-config.dto';
import { CreateDeviceDto } from 'src/modules/device/dtos/create-device.dto';
@Injectable()
export class WattsenseService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('WATTSENSE_GET_API')
    private readonly wattsenseGetApiAuthenticator: WattsenseApiAuthenticator,
    private readonly wattsenseApiHelper: WattsenseApiHelper,
  ) {}

  //Function to retrieve all devices from a wattsense box - with status ONLINE === ON
  async getDevices(): Promise<CreateDeviceDto[]> {
    let devicesObservable: Observable<any | null> = null;

    //GET request that returns observable
    try {
      devicesObservable = this.httpService.get(
        this.wattsenseGetApiAuthenticator.getUrl('/v1/devices'),
        this.wattsenseGetApiAuthenticator.generateApiConfig(),
      );
    } catch (error) {
      console.log(error);
    }
    
    //Process the returned observable from the Get request
    let devicesObservableResult = await firstValueFrom(devicesObservable);
    let devicesData: WattsenseDeviceDto[] = devicesObservableResult.data;
    //Retrieve the the needed attributes from the array of devices objects

   

    let devices: CreateDeviceDto[] =
      this.wattsenseApiHelper.parseDevice(devicesData);
    return devices;
  }

  async getConfig(): Promise<CreateDeviceDto[]> {
    let devicesObservable: Observable<any | null> = null;

    //GET request that returns observable
    try {
      devicesObservable = this.httpService.get(
        this.wattsenseGetApiAuthenticator.getUrl('/v1/devices'),
        this.wattsenseGetApiAuthenticator.generateApiConfig(),
      );
    } catch (error) {
      console.log(error);
    }

    //Process the returned observable from the Get request
    let devicesObservableResult = await firstValueFrom(devicesObservable);
    let devicesData: WattsenseDeviceDto[] = devicesObservableResult.data;
    //Retrieve the the needed attributes from the array of devices objects
    let devices: CreateDeviceDto[] =
      this.wattsenseApiHelper.parseDevice(devicesData);
    return devices;
  }

  async getDevicesWithRelatedEntities() {
    let devices: CreateDeviceDto[] = await this.getDevices();
    
    let devicesObservables: Observable<any>[];

    let devicesEndpointsConfig: string[] =
      this.wattsenseApiHelper.generateGetConfigEndpoint(
        devices.map((device) => device.deviceId),
      );

    try {
      devicesObservables = devicesEndpointsConfig.map((deviceEndpointConfig) =>
        this.httpService.get(
          this.wattsenseGetApiAuthenticator.getUrl(deviceEndpointConfig),
          this.wattsenseGetApiAuthenticator.generateApiConfig(),
        ),
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const responseDataArray = await firstValueFrom(
        forkJoin(devicesObservables),
      );

      let devicesConfigurations: WattsenseDeviceConfigDto[][] =
        responseDataArray.map((response) => response.data);
      //return devicesConfigurations
      return this.wattsenseApiHelper.parseDeviceConfig(
        devicesConfigurations,
        devices,
      );
    } catch (error) {
      console.error('Error in fetching data for devices', error);
      throw error;
    }
  }
}
