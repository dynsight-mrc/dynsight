import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { ReadUserByOrganizationId } from '../dto/read-user.dto';

@Controller('users')
@UseGuards(AuthorizationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUsersDto) {
    return /* this.userService.createMany(createUserDto) */;
  }

  @Get('overview')
  async findAllOverview() {
    try {
      let users = await this.userService.findAllOverview();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupération des données utilisateurs",
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('')
  async findByOrganizationId(@Query('organization') organization: string) {
    try {
      let users = await this.userService.findByOrganizationId(organization);
      return users
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupération de la liste des utilisateus",
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
