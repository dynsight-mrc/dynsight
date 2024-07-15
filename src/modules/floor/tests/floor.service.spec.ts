import { Test, TestingModule } from '@nestjs/testing';
import { FloorService } from '../services/floor.service';
import { FloorModel } from '../models/floor.model';
import { getModelToken } from '@nestjs/mongoose';
import { Floor } from '../entities/floor.entity';
import { FloorServiceHelper } from '../services/floor-helper.service';
import mongoose from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('FloorService', () => {
  let floorService: FloorService;
  let floorServiceHelper: FloorServiceHelper;
  let floorModel: FloorModel;
  let mockFloorModel = {
    insertMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorService,
        FloorServiceHelper,
        { provide: getModelToken(Floor.name), useValue: mockFloorModel },
      ],
    }).compile();
    floorService = module.get<FloorService>(FloorService);
    floorServiceHelper = module.get<FloorServiceHelper>(FloorServiceHelper);
    floorModel = module.get<FloorModel>(getModelToken(Floor.name));
  });

  it('should be defined', () => {
    expect(floorService).toBeDefined();
    expect(floorServiceHelper).toBeDefined();
    expect(floorModel).toBeDefined();
  });

  describe('Create Many Floors', () => {
    it('should throw error on duplicate key', async () => {
      let createFloorsDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 3],
        organizationId: new mongoose.Types.ObjectId(),
        buildingId: new mongoose.Types.ObjectId(),
      };
      const duplicateKeyError = { code: 11000 };

      jest.spyOn(floorModel, 'insertMany').mockRejectedValue(duplicateKeyError);
      await expect(floorService.createMany(createFloorsDto)).rejects.toThrow(
        new HttpException(
          'Un ou plusieurs étages existent déja avec ces paramètres',
          HttpStatus.CONFLICT,
        ),
      );
    });
    it('should return a list of created floors', async () => {
      let createFloorsDto = {
        name: ['etage 1', 'etage 2', 'etage 3'],
        number: [1, 2, 3],
        organizationId: new mongoose.Types.ObjectId(),
        buildingId: new mongoose.Types.ObjectId(),
      };
      let mockFormtedFloors = floorServiceHelper.formatFloorsRawData(createFloorsDto)
      let mockReturnedFloors =mockFormtedFloors.map((ele) => ({...ele,
        id: new mongoose.Types.ObjectId()
      }))
    
      let session = {};
      //@ts-ignore
      jest.spyOn(floorModel, 'insertMany').mockResolvedValue(mockReturnedFloors)
      const floorsDocs = await floorService.createMany(createFloorsDto);
      expect(floorModel.insertMany).toHaveBeenCalledWith(
        mockFormtedFloors,
        session,
      );
      expect(floorsDocs).toEqual(mockReturnedFloors);

    });
  });
});
