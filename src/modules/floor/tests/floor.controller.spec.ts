import { Test, TestingModule } from '@nestjs/testing';
import { FloorController } from '../controllers/floor.controller';
import { FloorService } from '../services/floor.service';
import mongoose, { Types } from 'mongoose';

describe('FloorController', () => {
  let floorController: FloorController;
  let floorService: FloorService;
  let mockFloorSerice = {
    findByBuildingId: jest.fn(),
  };
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorController],
      providers: [{ provide: FloorService, useValue: mockFloorSerice }],
    }).compile();

    floorController = module.get<FloorController>(FloorController);
    floorService = module.get<FloorService>(FloorService);
  });

  it('should be defined', () => {
    expect(floorController).toBeDefined();
  });

  describe('findByBuildingId', () => {
    it('should return a list of floors', async () => {
        mockFloorSerice.findByBuildingId.mockResolvedValueOnce(mockFloorsData);
        let floors = await floorController.findByBuilding(mockBuildingId.toString())
        expect(floors).toBeDefined()
        floors.forEach(floor=>{
          expect(floor).toEqual({
            id:expect.any(Types.ObjectId),
            name:expect.any(String),
            number:expect.any(Number),
            buildingId:expect.any(Types.ObjectId),
            rooms:expect.any(Array)
          })
        })
        floors.forEach(floor=>{
          floor.rooms.forEach(room=>{
            expect(room).toEqual({
              id:expect.any(Types.ObjectId),
              name:expect.any(String),
              floorId:expect.any(Types.ObjectId),
            })
          })
        })
    });
  });
});
