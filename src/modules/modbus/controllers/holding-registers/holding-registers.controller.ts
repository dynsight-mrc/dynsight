import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { HoldingRegistersService } from '../../services/holding-registers/holding-registers.service';

@Controller('modbus')
export class HoldingRegistersController {
    constructor(
        private readonly holdingRegisterService:HoldingRegistersService
    ){

    }

    @Get("holdingregister/:id")
    async getHoldingRegister(@Param('id') id: string){
        try {
            return await this.holdingRegisterService.readHoldingRegister(id);
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
    @Post("holdingregister/:id")
    async writeHoldingRegister(@Param('id') id: string,@Body() body){
        
        try {
            return await this.holdingRegisterService.writeHoldingRegister(id,body.value);
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
