import { Types } from 'mongoose';
import { ReadBuildingDocumentDto } from '../building/read-buildng.dto';
import { ReadOrganizationDocumentDto } from '../organization/read-organization.dto';
import { ReadRoomDocumentDto, ReadRoomDocumentWithDetails } from '../room/read-rooms.dto';

export type ReadFloorDocumentDto = {
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
  elevatorAccess?: boolean;
  securityFeatures?: string[];
  facilities?: string[];
  occupants?: Types.ObjectId[];
  lastRenovated?: number;
  maintenanceLogs?: Types.ObjectId[];
  emergencyContact?: string;
  isAccessible?: boolean;
  notes?: string;
};

export type ReadFloorDocumentWithDetailsDto = {
  id:Types.ObjectId
  number: number;
  name: string;
  surface?: number;
  building: ReadBuildingDocumentDto;
  organization: ReadOrganizationDocumentDto;
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

export type ReadFloorDocumentWithRoomsDetailsDto = {
  id:Types.ObjectId
  number: number;
  name: string;
  surface?: number;
  building: ReadBuildingDocumentDto;
  organization: ReadOrganizationDocumentDto;
  numberOfRooms?: number;
  occupancyStatus?: 'Vacant' | 'Occupied' | 'Under Maintenance';
  constructionYear?: number;
  floorPlan?: string;
  height?: number;
  fireExits?: number;
  elevatorAccess?: boolean;
  securityFeatures?: string[];
  facilities?: string[];
  occupants?: Types.ObjectId[];
  lastRenovated?: number;
  maintenanceLogs?: Types.ObjectId[];
  emergencyContact?: string;
  isAccessible?: boolean;
  notes?: string;
  rooms: ReadRoomDocumentWithDetails[];
};


export type ReadFloorDocumentDetailsWithRoomsDto = {
  id:Types.ObjectId
  number: number;
  name: string;
  surface?: number;
  building: ReadBuildingDocumentDto;
  organization: ReadOrganizationDocumentDto;
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
  rooms: ReadRoomDocumentDto[];
};
