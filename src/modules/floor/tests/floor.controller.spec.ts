import { Test, TestingModule } from '@nestjs/testing';
import { FloorController } from '../controllers/floor.controller';
import { FloorService } from '../services/floor.service';

describe('FloorController', () => {
  let floorController: FloorController;
  let floorService:FloorService
  let mockFloorSerice = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorController],
      providers:[{provide:FloorService,useValue:mockFloorSerice}]
    }).compile();

    floorController = module.get<FloorController>(FloorController);
    floorService  = module.get<FloorService>(FloorService)
  });

  it('should be defined', () => {
    expect(floorController).toBeDefined();
  });
});
