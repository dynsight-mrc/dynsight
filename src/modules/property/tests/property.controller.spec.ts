import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';

describe('PropertyController', () => {
  let controller: PropertyController;

  const mockPropertyService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [PropertyService],
    })
      .overrideProvider(PropertyService)
      .useValue(mockPropertyService)
      .compile();

    controller = module.get<PropertyController>(PropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
