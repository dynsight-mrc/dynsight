import { Test, TestingModule } from '@nestjs/testing';
import { WattsenseController } from '../controllers/wattsense.controller';

describe('WattsenseController', () => {
  let controller: WattsenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WattsenseController],
    }).compile();

    controller = module.get<WattsenseController>(WattsenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
