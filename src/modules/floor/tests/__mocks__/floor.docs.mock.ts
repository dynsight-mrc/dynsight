import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import mongoose from 'mongoose';

export let mockRoomId = new mongoose.Types.ObjectId();
export let mockBuildingId = new mongoose.Types.ObjectId();
export let mockFloorId = new mongoose.Types.ObjectId();
export let mockOrganizationId = new mongoose.Types.ObjectId(
  '668e8c274bf69a2e53bf59f1',
);

export const mockCreateFloorsAttrs = {
  name: ['etage 1', 'etage 2', 'etage 3'],
  number: [1, 2, 3],
  organizationId: mockOrganizationId.toString(),
  buildingId: mockBuildingId.toString(),
};

export const mockFloorsDocs = [
  {
    name: 'etage 1',
    id: new mongoose.Types.ObjectId(),
    number: 1,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
  },
  {
    name: 'etage 2',
    id: new mongoose.Types.ObjectId(),
    number: 1,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
  },
  {
    name: 'etage 3',
    id: new mongoose.Types.ObjectId(),
    number: 1,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
  },
];

export const mockRoomsDocs = [
  {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 1',
    floorId: mockFloorId,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
    surface: 25,
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 2',
    floorId: mockFloorId,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
    surface: 40,
  },
];

export const createFloorsWithRoomsDto = {
  floors: {
    name: ['etage 1', 'etage 2', 'etage 3'],
    number: [1, 2, 3],
  },
  blocs: {
    name: ['bloc 1', 'bloc 2'],
    type: ['office', 'storage'],
    surface: [25, 40],
    floors: ['etage 1', 'etage 3'],
  },
};

export const mockFloorsData = [
  {
    name: 'etage 1',
    id: mockFloorId,
    number: 1,
    buildingId: mockBuildingId,
    organizationId: mockOrganizationId,
    rooms: [
      {
        id: new mongoose.Types.ObjectId(),
        name: 'bloc 1',
        floorId: mockFloorId,
        buildingId: mockBuildingId,
        organizationId: mockOrganizationId,
        surface: 25,
      },
    ],
  },
];
export const mockFloorWithDetails = {
  name: 'etage 1',
  id: mockFloorId,
  number: 1,
  building: {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 1',
  },
  organization: {
    id: new mongoose.Types.ObjectId(),
    name: 'organization_name',
  },
};
export const mockConnection = {
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
};

let mockBuildingPopulatedOrganization = {
  id: mockBuildingId,
  organization: {
    id: mockOrganizationId,
    name: 'organizaion',
    owner: 'owner',
  },
  reference: 'string',
  name: 'string',
  constructionYear: 2012,
  surface: 290,
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
  type: 'industry',
};
