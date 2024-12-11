import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import mongoose from 'mongoose';

export let mockRoomId = new mongoose.Types.ObjectId();
export let mockBuildingId = new mongoose.Types.ObjectId();
export let mockFloorId = new mongoose.Types.ObjectId();
export let mockOrganizationId = new mongoose.Types.ObjectId(
  '668e8c274bf69a2e53bf59f1',
);

export let mockRoomDocWithDetails = {
  id: mockRoomId,
  name: 'bloc 1',
  floor: {
    id: new mongoose.Types.ObjectId(),
    name: 'etage 1',
    number: 1,
  },
  building: {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 1',
  },
  organization: {
    id: new mongoose.Types.ObjectId(),
    name: 'organization_name',
  },
  surface: 25,
};
export let mockRoomDoc = {
  id: mockRoomId,
  name: 'bloc 1',
  floorId: mockFloorId,
  buildingId: mockBuildingId,
  organizationId: mockBuildingId,
  surface: 25,
  type:"industrial"
};

export let createRoomsAttrsDto = {
  name: ['bloc 1', 'bloc 2'],
  type: ['office', 'office 2'],
  surface: [12, 35],
  floors: ['etage 1s', 'etage 3s'],
};

export let mockBuildingDoc = {
  id: mockBuildingId,
  reference: 'X12B4',
  name: 'building1',
  constructionYear: 2003,
  surface: 150,
  type: 'industry',
  address: {
    streetAddress: '123 Main St',
    streetNumber: '123',
    streetName: 'Main St',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: 75001,
    country: 'France',
    coordinates: {
      lat: 123,
      long: 3344,
    },
  },

  organizationId: mockOrganizationId,
};
export let createRoomDocumentAttrsDto:CreateRoomDocumentAttrsDto = {
  name: 'bloc 1',

  floorId: mockFloorId,

  buildingId: mockBuildingId,

  organizationId: mockOrganizationId,
  surface:12
};

export let mockFloorsDocs: CreateFloorDto[] = [
  {
    id: new mongoose.Types.ObjectId(),
    name: 'etage 1s',
    number: 1,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'etage 3s',
    number: 2,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
  },
];

export let mockConnection = {
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
};
