import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsObject, IsString, ValidateNested } from "class-validator";
import { DeviceStatus } from "src/common/wattsense/enums/device-status.enum";


enum DeviceConfigOrigin {
  da = 'da',
  cloud = 'cloud',
}


class DeviceSubscription{
    ratePlan: string;

    @IsInt()
    addons: number;

    @IsBoolean()
    autoRenew: boolean;

    @IsBoolean()
    yearly: boolean;

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;

    @IsString()
    updatedBy: string;

    @IsString()
    updatedAt: string;

    @IsString()
    managedByWattsense: boolean;

    @IsArray()
    options: [];
  };

  class DeviceVersionInfo {
    @IsString()
    bsp: string;

    @IsString()
    hardware: string;

    @IsString()
    software: string;

  }; 

export class WattsenseDeviceDto {
  
  @IsString()  
  deviceId: string;

  @IsString()
  hardwareId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  externalId: string;

  @IsString()
  tenantId: string;

  @IsString()
  organizationId: string;

  @IsString()
  siteId: string;

  @IsString()
  deviceGroupId: string;

  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  
  @ValidateNested()
  @Type(()=>DeviceVersionInfo)
  deviceVersionInfo: DeviceVersionInfo

  @IsEnum(DeviceConfigOrigin)
  deviceConfigOrigin: DeviceConfigOrigin;

  @ValidateNested()
  @Type(()=>DeviceSubscription)
  deviceSubscription : DeviceSubscription
  
  
  tags: {};
}
