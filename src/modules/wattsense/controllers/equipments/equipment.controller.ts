
import { Controller } from '@nestjs/common';
import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
import { EquipmentService } from '../../services/equipments/equipment.service';
import { CreateEquipmentDto } from '../../dtos/equipments/create-equipment.dto';


@Controller('equipments')
export class EquipmentController {
    constructor(private readonly equipmentService:EquipmentService){
        
    }



  @Post()
  create(@Body() createEquipmentDto:CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.equipmentService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
