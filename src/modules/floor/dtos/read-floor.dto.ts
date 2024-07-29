import { ReadRoomWithFloorId } from '@modules/room/dtos/read-room-dto';
import { Types } from 'mongoose';

export type ReadFloorDto = {
  id:Types.ObjectId
  number: number;
  name: string;
  surface?: number;
  buildingId: Types.ObjectId;
  organizationId: Types.ObjectId;
  numberOfRooms?: number;
  occupancyStatus?: 'Vacant' | 'Occupied' | 'Under Maintenance';
  constructionYear?: number;
  floorPlan?: string;
  height?: number;
  fireExits?: number;
  elevatorAccess: boolean;
  securityFeatures?: string[];
  facilities?: string[];
  occupants?: Types.ObjectId[];
  lastRenovated?: number;
  maintenanceLogs?: Types.ObjectId[];
  emergencyContact?: string;
  isAccessible?: boolean;
  notes?: string;
};
export type ReadFloordWithBuildingId = {
  number: number;
  name: string;
  buildingId:  Types.ObjectId;
  id:  Types.ObjectId;
};

export type ReadFloorWithDetailedRoomsList = {
  number: number;
  name: string;
  buildingId:  Types.ObjectId;
  id:  Types.ObjectId;
  rooms: ReadRoomWithFloorId[];
};
