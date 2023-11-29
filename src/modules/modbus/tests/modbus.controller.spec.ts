import { Test, TestingModule } from '@nestjs/testing';
import { ModbusController } from '../controllers/modbus.controller';

describe('ModbusController', () => {
  let controller: ModbusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModbusController],
    }).compile();

    controller = module.get<ModbusController>(ModbusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
