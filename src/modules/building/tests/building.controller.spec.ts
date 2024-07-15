import { Test, TestingModule } from '@nestjs/testing';
import { BuildingController } from '../controllers/building.controller';
import { BuildingService } from '../services/building.service';

describe('BuildingController', () => {
  let buildingController: BuildingController;
  let buildingService : BuildingService
  let mockBuildingService = {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers:[{provide:BuildingService,useValue:mockBuildingService}]
    }).compile();

    buildingController = module.get<BuildingController>(BuildingController);
    buildingService = module.get<BuildingService>(BuildingService)
  });

  it('should be defined', () => {
    expect(buildingController).toBeDefined();
  });
});
