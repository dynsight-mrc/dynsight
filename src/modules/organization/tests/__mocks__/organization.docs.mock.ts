import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { ReadBuildingDocumentwithDetailsDto, ReadBuildingDocumentWithFloorsDetailsDto } from '@modules/shared/dto/building/read-buildng.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import mongoose from 'mongoose';

export let mockRoomId = new mongoose.Types.ObjectId();
export let mockBuildingId = new mongoose.Types.ObjectId();
export let mockFloorId = new mongoose.Types.ObjectId();
export let mockOrganizationId = new mongoose.Types.ObjectId(
  '668e8c274bf69a2e53bf59f1',
);
export const mockResolvedOrganizationsOverview = [
  {
    name: 'Xiaomi',
    reference: 'AB13',
    description: 'Tech Company',
    owner: 'Mao Si Tong',
    numberOfBuildings: 1,
    totalSurface: 350,
    id: new mongoose.Types.ObjectId('6698f8f03b58ac9f0cd9dc41'),
  },
];
export const mockOrganizationDoc = {
  id: mockOrganizationId,
  name: 'string',
  reference: 'string',
  description: 'string',
  owner: 'string',

};
export const mockBuildingDocs = [
  {
    reference: 'BAT_1',
    name: 'Mobile Corporation',
    constructionYear: 2020,
    surface: 125,
    address: {},
    type: 'commercial',
    id: new mongoose.Types.ObjectId(),
  },
];

export const mockFloorsDocs = [
  {
    name: 'etage 1',
    id: new mongoose.Types.ObjectId(),
    number: 1,
    buildingId: mockBuildingDocs[0].id,
  },
  {
    name: 'etage 2',
    id: new mongoose.Types.ObjectId(),
    number: 1,
    buildingId: mockBuildingDocs[0].id,
  },
];

export const mockRoomsDocs = [
  { name: 'bloc 1', floorId: mockFloorsDocs[0].id },
  { name: 'bloc 2', floorId: mockFloorsDocs[1].id },
];
export const mockBuildingDocWithFloorsDetails = {
  id: mockBuildingId,
  organization: {
    id: mockOrganizationId,
    name: 'organizaion',
    owner: 'owner',
    reference:"",
    description:""
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
  floors: [
    {
      name: 'etage 1',
      id: mockFloorId,
      number: 1,
      building:{id: mockBuildingId,name:""},
      organization: {id:mockOrganizationId,name:""},
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
  ],
};
export const mockOrganizationDocWithDetails={
  ...mockOrganizationDoc,
  buildings:[mockBuildingDocWithFloorsDetails]
}

