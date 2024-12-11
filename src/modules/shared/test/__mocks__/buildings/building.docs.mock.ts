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

export const mockBuildingDoc = {
  id: mockBuildingId,
  organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
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
export const mockBuildingDocWithFloorsDetails :ReadBuildingDocumentWithFloorsDetailsDto= {
  id: mockBuildingId,
  organization: {
    id: mockOrganizationId,
    name: 'organizaion',
    owner: 'owner',
    description:'',
    reference:''
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
      building: {
        id: mockBuildingId,
        name: 'building',
        reference:"reference",
        surface:100,
        type:"type",
        constructionYear:2020,
        organizationId:mockOrganizationId,
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
      },
      organization: {
        id: mockOrganizationId,
        name: 'organizaion',
        owner: 'owner',
        reference: '',
        description: '',
      },
      rooms: [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'bloc 1',
          floor:{id: mockFloorId,name:"",number:34},
          building: {id:mockBuildingId,name:""},
          organization: {id:mockOrganizationId,name:""},
          surface: 25,
        },
      ],
    },
  ],
};

export const mockBuildingDocWithDetails = {
  id: mockBuildingId,
  organization: {
    id: mockOrganizationId,
    name: 'organizaion',
    owner: 'owner',
    reference: '',
    description: '',
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

export const createBuildingDto = {
  reference: 'string',
  name: 'string',
  constructionYear: 2012,
  surface: 290,
  organizationId: mockOrganizationId.toString(),
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
};
export const mockConnection = {
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
};
