import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { ReadAccountDto } from '../dto/read-account.dto';
import { CreateAccountAttrsDto } from '../dto/create-account.dto';

@Controller('accounts')
@UseGuards(AuthorizationGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // /api/accounts
  // CREATE A USER ACCOUNT (ORGANIZATION,USERS, ONE BUILDING=>FLOOS=>ROOMS)
  @Post()
  @HttpCode(201)
  async create(
    @Body() createAccountDto: CreateAccountAttrsDto,
  ): Promise<ReadAccountDto> {

    try {
      let account = await this.accountService.create(createAccountDto);
     
      return account;
    } catch (error) {
      
      throw new InternalServerErrorException(
        `Erreur lors de la création du compte,${error.message}`
      );
    }
  }
}
