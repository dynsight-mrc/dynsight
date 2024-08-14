import { Test, TestingModule } from '@nestjs/testing';
import { FloorController } from '../controllers/floor.controller';
import { FloorService } from '../services/floor.service';
import mongoose, { Types } from 'mongoose';

describe('FloorController', () => {
  let floorController: FloorController;
  let mockFloorSerice = {
    findByBuildingId: jest.fn(),
    createManyWithRooms:jest.fn()
  };
  let mockOrganizationId = new mongoose.Types.ObjectId();

  let mockBuildingId = new mongoose.Types.ObjectId();
  let mockFloorId = new mongoose.Types.ObjectId();
  let mockFloorsData = [
    {
      name: 'etage 1',
      id: mockFloorId,
      number: 1,
      buildingId: mockBuildingId,
      rooms: [
        {
          id: new mongoose.Types.ObjectId(),
          name: 'bloc 1',
          floorId: mockFloorId,
        },
      ],
    },
  ];
  const mockFloorsDocs = [
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

  const mockRoomsDocs = [
    {
      id: new mongoose.Types.ObjectId(),
      name: 'bloc 1',
      floorId: mockFloorsDocs[0].id,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
      surface: 25,
    },
    {
      id: new mongoose.Types.ObjectId(),
      name: 'bloc 2',
      floorId: mockFloorsDocs[1].id,
      buildingId: mockBuildingId,
      organizationId: mockOrganizationId,
      surface: 40,
    },
  ];
  let createFloorsWithRoomsDto = {
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
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorController],
      providers: [{ provide: FloorService, useValue: mockFloorSerice }],
    }).compile();

    floorController = module.get<FloorController>(FloorController);
  });

  it('should be defined', () => {
    expect(floorController).toBeDefined();
  });

  describe('findByBuildingId', () => {
    it('should return a list of floors', async () => {
      mockFloorSerice.findByBuildingId.mockResolvedValueOnce(mockFloorsData);
      let floors = await floorController.findByBuilding(
        mockBuildingId.toString(),
      );
      expect(floors).toBeDefined();
      floors.forEach((floor) => {
        expect(floor).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),
          rooms: expect.any(Array),
        });
      });
      floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          expect(room).toEqual({
            id: expect.any(Types.ObjectId),
            name: expect.any(String),
            floorId: expect.any(Types.ObjectId),
          });
        });
      });
    });
  });

  describe('createManyWithRooms', () => {
    it('should return a list of created floors and created rooms', async () => {
      mockFloorSerice.createManyWithRooms.mockResolvedValueOnce({floors:mockFloorsDocs,rooms:mockRoomsDocs})
      let { floors, rooms } = await floorController.createManyWithRooms(
        mockBuildingId.toString(),
        createFloorsWithRoomsDto,
      );
      floors.forEach((floor) => {
        expect(floor).toEqual({
          name: expect.any(String),
          id: expect.any(Types.ObjectId),
          number: expect.any(Number),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
        });
      });
      rooms.forEach((room) => {
        expect(room).toEqual({
          id: expect.any(Types.ObjectId),
          name: expect.any(String),
          floorId: expect.any(Types.ObjectId),
          buildingId: expect.any(Types.ObjectId),
          organizationId: expect.any(Types.ObjectId),
          surface: expect.any(Number),
          type:expect.any(String)

        });
      });
    });
  });
});
