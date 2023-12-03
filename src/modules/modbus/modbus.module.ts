import { Module } from '@nestjs/common';
import { ModbusService } from './services/modbus.service';
import { ModbusController } from './controllers/modbus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coil, CoilSchema } from './models/coil.model';
import {
  DiscreteInput,
  DiscreteInputSchema,
} from './models/discrete-input.model';
import {
  HoldingRegister,
  HoldingRegisterSchema,
} from './models/holding-regster.model';
import {
  InputRegister,
  InputRegisterSchema,
} from './models/input-register.model';
import {
  CoilsRepositoryController,
} from './controllers/coils/coils-repository.controller';
import { CoilsService } from './services/coils/coils.service';
import { DiscreteInputsService } from './services/discrete-inputs/discrete-inputs.service';
import { HoldingRegistersService } from './services/holding-registers/holding-registers.service';
import { InputRegistersService } from './services/input-registers/input-registers.service';
import { CoilsController } from './controllers/coils/coils.controller';
import { DiscreteInputsController } from './controllers/discrete-inputs/discrete-inputs.controller';
import { DiscreteInputsRepositoryController } from './controllers/discrete-inputs/discrete-inputs-repository.controller';
import { HoldingRegistersController } from './controllers/holding-registers/holding-registers.controller';
import { HoldingRegistersRepositoryController } from './controllers/holding-registers/holding-registers-repository.controller';
import { InputRegistersController } from './controllers/input-registers/input-registers.controller';
import { InputRegistersRepositoryController } from './controllers/input-registers/input-registers-repository.controller';
import { CoilsRepositoryService } from './services/coils/coils-repository.service';
import { DiscreteInputsRepositoryService } from './services/discrete-inputs/discrete-inputs-repository.service';
import { HoldingRegistersRepositoryService } from './services/holding-registers/holding-registers-repository.service';
import { InputRegistersRepositoryService } from './services/input-registers/input-registers-repository.service';
import { ModbusIpServerService } from './services/modbus-ip-server/modbus-ip-server.service';
import { ModbusIpServer, ModbusIpServerSchema } from './models/modbus-ip-server.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModbusIpServer.name, schema: ModbusIpServerSchema },
      { name: Coil.name, schema: CoilSchema },
      { name: DiscreteInput.name, schema: DiscreteInputSchema },
      { name: HoldingRegister.name, schema: HoldingRegisterSchema },
      { name: InputRegister.name, schema: InputRegisterSchema },
    ]),
  ],
  providers: [
    ModbusIpServerService,
    CoilsService,
    CoilsRepositoryService,
    DiscreteInputsService,
    DiscreteInputsRepositoryService,
    HoldingRegistersService,
    HoldingRegistersRepositoryService,
    InputRegistersService,
    InputRegistersRepositoryService
  ],
  controllers: [
    ModbusController,
    CoilsRepositoryController,
    CoilsController,
    DiscreteInputsController,
    DiscreteInputsRepositoryController,
    HoldingRegistersController,
    HoldingRegistersRepositoryController,
    InputRegistersController,
    InputRegistersRepositoryController
  ],
})
export class ModbusModule {}
