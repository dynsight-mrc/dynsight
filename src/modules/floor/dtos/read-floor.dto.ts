import { ReadBuildingDocumentDto } from '@modules/shared/dto/building/read-buildng.dto';
import { ReadOrganizationDocumentDto } from '@modules/shared/dto/organization/read-organization.dto';
import { Types } from 'mongoose';



export type ReadFloordWithBuildingId = {
  number: number;
  name: string;
  buildingId:  Types.ObjectId;
  id:  Types.ObjectId;
};

/* export type ReadFloorWithDetailedRoomsList = {
  number: number;
  name: string;
  buildingId:  Types.ObjectId;
  id:  Types.ObjectId;
  rooms: ReadRoomWithFloorId[];
};
 */