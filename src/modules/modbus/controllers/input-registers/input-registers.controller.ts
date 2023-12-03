import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { InputRegistersService } from '../../services/input-registers/input-registers.service';

@Controller('modbus')
export class InputRegistersController {
    constructor(
        private readonly inputRegistersService:InputRegistersService
    ){

    }

    @Get("inputregister/:id")
    async readInputRegister(@Param("id") id:string){
        try {
            let data = await this.inputRegistersService.readInputRegister(id);
            return data;
          } catch (error) {
            throw new HttpException(
              {
                status: HttpStatus.FORBIDDEN,
                error: error.message,
              },
              HttpStatus.FORBIDDEN,
            );
          }
    }
}
