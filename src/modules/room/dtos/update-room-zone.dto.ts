import { IsString } from "class-validator";

export class UpdateRoomZone{

    @IsString()
    zone:string
}