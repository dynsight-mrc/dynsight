import { Module } from '@nestjs/common';
import { ModbusService } from './services/modbus.service';
import { ModbusController } from './controllers/modbus.controller';

@Module({
  providers: [ModbusService],
  controllers: [ModbusController]
})
export class ModbusModule {}
