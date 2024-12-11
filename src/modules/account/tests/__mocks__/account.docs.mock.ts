import mongoose from 'mongoose';

export let mockRoomId = new mongoose.Types.ObjectId();
export let mockBuildingId = new mongoose.Types.ObjectId();
export let mockFloorId = new mongoose.Types.ObjectId();
export let mockOrganizationId = new mongoose.Types.ObjectId(
  '668e8c274bf69a2e53bf59f1',
);

export const mockUserDocs = [
  {
    id: new mongoose.Types.ObjectId('668fc03580882d6c01ff4790'),
    personalInformation: { firstName: 'user 1', lastName: 'lastname 1' },
    contactInformation: { email: 'email@dynsight.fr' },
    authentication: { username: 'email@dynsight.fr', password: 'password' },
    permissions: {
      role: 'OO',
      organizationId: mockOrganizationId,
      buildingId: mockBuildingId,
    },
    profileInformation: undefined,
    preferences: undefined,
  },
];

export const mockRoomsDocs = [
  {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 1',
    organizationId: mockOrganizationId,
    buildingId: mockBuildingId,
    floorId: mockFloorId,
    surface: 200,
    type: 'office',
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'bloc 2',
    organizationId: mockOrganizationId,
    buildingId: mockBuildingId,
    floorId: mockFloorId,
    surface: 400,
    type: 'storage',
  },
];

export const mockFloorsDocs = [
  {
    id: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
    number: 1,
    name: 'etage 1',
    organizationId: mockOrganizationId,
    buildingId: mockBuildingId,
  },
  {
    id: new mongoose.Types.ObjectId('668e6f6250c10dd49808dc5a'),
    number: 2,
    name: 'etage 2',
    organizationId: mockOrganizationId,
    buildingId: mockBuildingId,
  },
  {
    id: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
    number: 3,
    name: 'etage 3',
    organizationId: mockOrganizationId,
    buildingId: mockBuildingId,
  },
];

export const mockBuildingDoc = {
  id: mockBuildingId,
  organizationId: mockOrganizationId,
  reference: 'building mine pro',
  name: 'building mine pro',
  constructionYear: 2003,
  surface: 250,
  address: {
    streetAddress: '123 Main St',
    streetNumber: '123',
    streetName: 'Main St',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: '75001',
    country: 'France',
    coordinates: {
      lat: 123,
      long: 3344,
    },
  },
  type: 'industry',
};
export const mockOrganizationDoc = {
  id: mockOrganizationId,
  reference: 'MINE pro max',
  name: 'MINE pro max pkus ',
  description: 'MINE',
  owner: 'MINE',
};

export const mockCreateAccountAttrs = {
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
  users: {
    firstName: ['user 1'],
    lastName: ['lastname 1'],
    email: ['email@dynsight.fr'],
    password: ['password'],
    role: ['organization-owner'],
  },
  organization: {
    reference: 'MINE pro max',
    name: 'MINE pro max pkus ',
    description: 'MINE',
    owner: 'MINE',
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

export const mockCreatedAccount = {
  organization: {
    id: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
    reference: 'MINE pro max',
    name: 'MINE pro max pkus ',
    description: 'MINE',
    owner: 'MINE',
  },
  building: {
    id: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
    organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
    reference: 'building mine pro',
    name: 'building mine pro',
    constructionYear: 2003,
    surface: 250,
    address: {
      streetAddress: '123 Main St',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75001',
      country: 'France',
      coordinates: {
        lat: 123,
        long: 3344,
      },
    },
    type: 'industry',
  },
  floors: [
    {
      id: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
      number: 1,
      name: 'etage 1',
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
    },
    {
      id: new mongoose.Types.ObjectId('668e6f6250c10dd49808dc5a'),
      number: 2,
      name: 'etage 2',
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
    },
    {
      id: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
      number: 3,
      name: 'etage 3',
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
    },
  ],
  rooms: [
    {
      name: 'bloc 1',
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      floorId: new mongoose.Types.ObjectId('668e6f594d6eb6046c01b9c1'),
      surface: 200,
      type: 'office',
    },
    {
      name: 'bloc 2',
      organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
      buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      floorId: new mongoose.Types.ObjectId('668e6f670a6816b206086fea'),
      surface: 400,
      type: 'storage',
    },
  ],
  users: [
    {
      id: new mongoose.Types.ObjectId('668fc03580882d6c01ff4790'),
      personalInformation: { firstName: 'user 1', lastName: 'lastname 1' },
      contactInformation: { email: 'email@dynsight.fr' },
      authentication: { username: 'email@dynsight.fr', password: 'password' },
      permissions: {
        role: 'OO',
        organizationId: new mongoose.Types.ObjectId('668e6e2ddb4c17164be2d6a1'),
        buildingId: new mongoose.Types.ObjectId('668e6f36f4a548387c3e46ba'),
      },
      profileInformation: undefined,
      preferences: undefined,
    },
  ],
};
