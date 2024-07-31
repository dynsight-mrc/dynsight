import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { ReadAccountDto } from '../dto/read-account.dto';

@Controller('accounts')
@UseGuards(AuthorizationGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // /api/accounts
  // CREATE A USER ACCOUNT (ORGANIZATION,USERS, ONE BUILDING=>FLOOS=>ROOMS) 
  @Post()
  @HttpCode(201)
  create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<ReadAccountDto> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
