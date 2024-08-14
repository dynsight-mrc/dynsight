import { Test, TestingModule } from '@nestjs/testing';
import { BuildingController } from '../controllers/building.controller';
import { BuildingService } from '../services/building.service';
import mongoose, { Types } from 'mongoose';
import { CreateBuildingWithRelatedEntities } from '../dtos/create-building.dto';

describe('BuildingController', () => {
  let buildingController: BuildingController;
  let buildingService: BuildingService;
  let mockBuildingId = new mongoose.Types.ObjectId();
  let mockOrganizationId = new mongoose.Types.ObjectId();

  const mockFloorsDocs = [
    {
      name: 'etage 1',
      id: new mongoose.Types.ObjectId(),
      number: 1,
      buildingId: mockBuildingId,
    },
  ];

  let mockRoomsDocs = [
    { name: 'bloc 1', floorId: mockFloorsDocs[0].id },
    { name: 'bloc 2', floorId: mockFloorsDocs[0].id },
  ];
  let mockBuilding = {
    id: mockBuildingId,
    organizationId: mockOrganizationId,
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
    floors: [{ ...mockFloorsDocs[0], rooms: mockRoomsDocs }],
  };

  let mockBuildingService = {
    findOne: jest.fn().mockResolvedValueOnce(mockBuilding),
    findByOrganizationId: jest.fn().mockResolvedValueOnce([mockBuilding]),
    findAllOverview: jest.fn().mockResolvedValueOnce([
      {
        id: new mongoose.Types.ObjectId(),
        reference: 'string',
        name: 'string',
        constructionYear: 2012,
        surface: 290,
        coordinates: { lat: 123, long: 123 },
        type: 'industry',
        organization: { name: 'organization', owner: 'owner' },
        numberOfFloors: 1,
        numberOfRooms: 1,
      },
    ]),
    createBuildingWithRelatedEntites: jest.fn(),
  };
  let createBuildingWithRelatedEntites: CreateBuildingWithRelatedEntities = {
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
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [{ provide: BuildingService, useValue: mockBuildingService }],
    }).compile();

    buildingController = module.get<BuildingController>(BuildingController);
    buildingService = module.get<BuildingService>(BuildingService);
  });

  it('should be defined', () => {
    expect(buildingController).toBeDefined();
  });
  describe('findOne', () => {
    it('should return the requested builiding', async () => {
      let building = await buildingController.findOne(
        mockBuildingId.toString(),
      );
      expect(building).toBeDefined();
      expect(building.floors.length).toEqual(1);
      expect(building.floors[0].rooms.length).toEqual(2);
    });
  });
  describe('findByOrganizationId', () => {
    it('should return an array of  requested builidings', async () => {
      let buildings = await buildingController.findByOrganizationId(
        mockOrganizationId.toString(),
      );
      expect(buildings).toBeDefined();
      expect(buildings.length).toEqual(1);
    });
  });
  describe('findAllOverview', () => {
    it('should return a list of buildings with organization name,owner,', async () => {
      let buildings = await buildingController.findAllOverview();
      expect(buildings).toBeDefined();
      expect(buildings.length).toEqual(1);
    });
  });
  describe('createBuildingWithRelatedEntites', () => {
    it('should return all the created entities, building, floors[],rooms[]', async () => {
      let buildingDoc = {...mockBuilding}
      delete buildingDoc.floors
      mockBuildingService.createBuildingWithRelatedEntites.mockResolvedValueOnce(
        {
          organization: mockOrganizationId,
          building: buildingDoc,
          floors: mockFloorsDocs,
          blocs: mockRoomsDocs,
        },
      );
      let results = await buildingService.createBuildingWithRelatedEntites(
        createBuildingWithRelatedEntites,
        mockOrganizationId.toString(),
      );
      expect(results).toBeDefined();
     
      expect(results.building).toBeDefined();
      expect(results.building).toEqual({
        id: expect.any(Types.ObjectId),
        reference: expect.any(String),
        name: expect.any(String),
        constructionYear: expect.any(Number),
        surface: expect.any(Number),
        type: expect.any(String),
        address: {
          streetAddress: expect.any(String),
          streetNumber: expect.any(String),
          streetName: expect.any(String),
          city: expect.any(String),
          state: expect.any(String),
          postalCode: expect.any(Number),
          country: expect.any(String),
          coordinates: {
            lat: expect.any(Number),
            long: expect.any(Number),
          },
        },
        organizationId: expect.any(Types.ObjectId),
      });
      expect(results.floors).toBeDefined();
      results.floors.forEach((floor) =>
        expect({
          name: expect.any(String),
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),
        }),
      );
      expect(results.blocs).toBeDefined();
      results.blocs.forEach((bloc) =>
        expect({
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
        }),
      );
      expect(results.organization).toBeDefined();
      expect(results.organization).toEqual(expect.any(Types.ObjectId));
    });
  });

});
