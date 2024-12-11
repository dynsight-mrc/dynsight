import {
  Controller,

} from '@nestjs/common';
import { FloorService } from '../services/floor.service';


@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}
 
 
}
