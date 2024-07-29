import { CreateAccountDto } from "@modules/account/dto/create-account.dto";

export const createAccountPayload: CreateAccountDto = {
    building: {
      reference: 'building mine pro',
      name: 'building mine pro max',
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
      email: ['emailz@dynsight.fr'],
      password: ['password'],
      role: ['organization-owner'],
    },
    organization: {
      reference: 'MINE pro max',
      name: 'MINE pro max',
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