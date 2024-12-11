import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { Field } from '@modules/shared/types/query-field.type';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { UsersService } from '../services/users.service';
import { UserSharedService } from '@modules/shared/services/user.shared.service';
import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';

@Controller('users')
@UseGuards(AuthorizationGuard)
export class UsersController {
  constructor(
    private readonly requestSharedService: RequestSharedService,
    private readonly userSharedService: UserSharedService,
  ) {}

  @Get('')
  async find(@Query('fields') fields: string | undefined) {
    let formatedFields;

    try {
      formatedFields =
        this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
          fields,
        );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des utilisateurs, Un ou plusierus parametères sont incorrectes',
      );
    }

    try {
      let users: ReadUserDocumentDto[] =
        await this.userSharedService.findMany(formatedFields);

      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des utilisateurs',
      );
    }
  }
}
