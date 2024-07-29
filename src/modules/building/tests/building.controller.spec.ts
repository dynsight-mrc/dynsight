import { Test, TestingModule } from '@nestjs/testing';
import { BuildingController } from '../controllers/building.controller';
import { BuildingService } from '../services/building.service';
import mongoose from 'mongoose';

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
      postalCode: '75001',
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
  };

  beforeEach(async () => {
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
});
