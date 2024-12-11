import { ReadBuildingDocumentDto } from "@modules/building/dtos/read-buildings.dto";
import { ReadFloorDocumentDto } from "@modules/shared/dto/floor/read-floor.dto";
import { ReadOrganizationDocumentDto } from "@modules/shared/dto/organization/read-organization.dto";
import { ReadRoomDocumentDto } from "@modules/shared/dto/room/read-rooms.dto";
import { ReadUserDocumentDto } from "@modules/shared/dto/user/read-user.dto";



export type ReadAccountDto = {
    organization: ReadOrganizationDocumentDto;
    building: ReadBuildingDocumentDto;
    floors: ReadFloorDocumentDto[];
    rooms: ReadRoomDocumentDto[];
    users: ReadUserDocumentDto[];
  };