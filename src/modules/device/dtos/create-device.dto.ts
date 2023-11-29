import { IsEnum, IsString, IsUUID } from "class-validator";
import { DeviceStatus } from "src/common/wattsense/enums/device-status.enum";

export class CreateDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsString()
  orgranizationId: string;

  @IsString()
  siteId: string;

  @IsEnum(DeviceStatus)
  status: DeviceStatus | string;
}
