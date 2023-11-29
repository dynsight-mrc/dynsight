import { Injectable } from '@nestjs/common';
import { ReadDeviceDto } from '../dtos/device/read-device.dto';
import { WattsenseDeviceDto } from '../dtos/device/wattsense-device.dto';
import { WattsenseDeviceConfigDto } from '../dtos/device/wattsense-device-config.dto';
import { WattsensePropertyDto } from '../dtos/property/wattsense-property.dto';
import { ReadDevicesDto } from '../dtos/device/read-devices.dto';
import { ReadPropertyDto } from '../dtos/property/read-property.dto';
import { isMqttGatewayLike } from '../dtos/property/mqtt-gateway.dto';


@Injectable()
export class WattsenseApiHelper {
  constructor() {}

  parseDevice(devices: WattsenseDeviceDto[]): ReadDeviceDto[] {
    let filteredDevices: ReadDeviceDto[] = devices
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

  parseProperty(property: WattsensePropertyDto): ReadPropertyDto {
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
    devices: ReadDeviceDto[],
  ): ReadDevicesDto[] {
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
        let { equipmentId, name } = equipment;
        let filterdParsedProperties = this.filterPropertiesByEquipmentId(
          properties,
          equipmentId,
        ).map((prop) => this.parseProperty(prop));

        deviceConfiguration['equipments'].push({
          equipmentId,
          name,
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
