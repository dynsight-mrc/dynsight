import { CreateFloorDto } from '@modules/floor/dtos/create-floors.dto';
import { CreateRoomDocumentAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import mongoose from 'mongoose';
import { CreateBuildingWithDetailsAttrsDto } from '../../dtos/create-building.dto';
import { describe } from 'node:test';

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
export const mockBuildingDocWithDetails = {
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
export let createRoomDocumentAttrsDto:CreateRoomDocumentAttrsDto = {
  name: 'bloc 1',

  floorId: mockFloorId,

  buildingId: mockBuildingId,

  organizationId: mockOrganizationId,
  surface:12
};
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

export const createBuildingWithDetails: CreateBuildingWithDetailsAttrsDto = {
  building: {
    reference: 'building mine pro',
    name: 'building mine pro',
    constructionYear: 2003,
    surface: 250,
    type: 'commercial',
  },
  floors: {
    name: ['etage 1', 'etage 2', 'etage 3'],
    number: [1, 2, 3],
  },
  blocs: {
    name: ['bloc 1', 'bloc 2'],
    type: ['office', 'storage'],
    surface: [200, 400],
    floors: ['etage 1', 'etage 3'],
  },
  location: {
    streetAddress: '123 MINE LOCATION',
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
  startTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  endSession: jest.fn(),
};
