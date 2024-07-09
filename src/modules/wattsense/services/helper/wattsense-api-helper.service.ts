import { Injectable } from '@nestjs/common';
import { WattsenseDeviceDto } from '../../dtos/devices/wattsense-device.dto';
import { WattsenseDeviceConfigDto } from '../../dtos/devices/wattsense-device-config.dto';
import { WattsensePropertyDto } from '../../dtos/properties/wattsense-property.dto';

import { isMqttGatewayLike } from '../../dtos/properties/mqtt-gateway.dto';
import { UpdateRoomPropertiesDto } from 'src/modules/room/dtos/update-room-property.dto';
import { CreateDeviceDto } from '../../dtos/devices/create-device.dto';
import { CreatePropertyDto } from '../../dtos/properties/create-property.dto';


@Injectable()
export class WattsenseApiHelper {
  constructor() {}

  parseDevice(devices: WattsenseDeviceDto[]): CreateDeviceDto[] {
    let filteredDevices: CreateDeviceDto[] = devices
      .filter((device) => device.status === 'ONLINE')
      .map((device) => {
        return {
          deviceId: device.deviceId,
          name: device.name,
          orgranizationId: device.organizationId,
          siteId: device.siteId,
          status: device.status,
        };
      });
    return filteredDevices;
  }

  parseProperty(property: WattsensePropertyDto): Partial<CreatePropertyDto> {
    return {
      propertyId: property.propertyId,
      name: property.name,
      config: property.config,
      unit: property.unit,
      accessType: property.accessType,
      disabled: property.disabled,
    };
  }

  parseDeviceConfig(
    devicesConfigurations: WattsenseDeviceConfigDto[][],
    devices: CreateDeviceDto[],
  ): UpdateRoomPropertiesDto[] {
    let devicesConfiguration = [];

    for (let device in devices) {
      let deviceConfiguration = {};

      deviceConfiguration = {
        ...devices[device],
        equipments: [],
      };

      let currentConfig = this.extractCurrnetConfig(
        devicesConfigurations[device],
      );

      let { equipments, properties } = currentConfig;

      equipments.forEach((equipment) => {
        let { equipmentId, name,config:{protocol} } = equipment;
        let filterdParsedProperties = this.filterPropertiesByEquipmentId(
          properties,
          equipmentId,
        ).map((prop) => this.parseProperty(prop));

        deviceConfiguration['equipments'].push({
          equipmentId,
          name,
          protocol,
          properties: filterdParsedProperties,
        });
      });
      devicesConfiguration.push(deviceConfiguration);
    }

    return devicesConfiguration;
  }

  filterPropertiesByEquipmentId(
    properties: WattsensePropertyDto[],
    equipmentId: string,
  ): WattsensePropertyDto[] {
    const props =  properties.filter(
      (prop) =>
        isMqttGatewayLike(prop.config)&&
        prop.disabled === false &&
        this.splitString(prop.config?.mqttSlug)[1] ===
          equipmentId.toLowerCase(),
    );      
    return props
  }

  splitString(text: string) {
    return text.split('_');
  }

  extractCurrnetConfig(
    configurations: WattsenseDeviceConfigDto[],
  ): WattsenseDeviceConfigDto {
    let currentConfig = configurations.find(
      (config) => config.status === 'CURRENT',
    );
    if (currentConfig === undefined) {
      currentConfig = configurations.find(
        (config) => config.status === 'DRAFT',
      );
    }
    return currentConfig;
  }

  generateGetConfigEndpoint(devicesIds: string[]): string[] {
    let devicesUrlsConfig: string[] = devicesIds.map(
      (deviceId) => `/v1/devices/${deviceId}/configs`,
    );
    return devicesUrlsConfig;
  }
}
