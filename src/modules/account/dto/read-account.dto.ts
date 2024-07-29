import { CreateBuildingDto } from '@modules/building/dtos/create-building.dto';
import { CreateFloorDto } from '@modules/floor/dtos/create-floor.dto';
import { CreateRoomDto } from '@modules/room/dtos/create-room.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { CreateOrganizationDto } from '@modules/organization/dtos/create-organization.dto';
import { ReadOrganizationDto } from '@modules/organization/dtos/read-organization.dto';
import { ReadBuildingDto } from '@modules/building/dtos/read-building.dto';
import { ReadFloorDto } from '@modules/floor/dtos/read-floor.dto';
import { ReadRoomDto } from '@modules/room/dtos/read-room-dto';
import { ReadUserDto } from '@modules/user/dto/read-user.dto';

export type ReadAccountDto = {
    organization: ReadOrganizationDto;
    building: ReadBuildingDto;
    floors: ReadFloorDto[];
    blocs: ReadRoomDto[];
    users: ReadUserDto[];
  };