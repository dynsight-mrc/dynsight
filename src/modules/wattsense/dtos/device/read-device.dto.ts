import { IsString } from "class-validator";

export class ReadDeviceDto{
  @IsString()  
  readonly deviceId: string;
  
  @IsString()  
  readonly name: string;
  
  @IsString()  
  readonly orgranizationId: string;
  
  @IsString()  
  readonly  siteId: string;

  @IsString()
  readonly status: "ONLINE"|"OFFLINE" |"NEVER_CONNECTED"
}