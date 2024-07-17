import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthCredentials } from '../dtos/user-auth-credentials.dto';
import * as jwt from 'jsonwebtoken';
import { AuthenticationService } from '../services/authentication.service';
import { PasswordServiceHelper } from '../services/password-helper.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly passwordServiceHelper: PasswordServiceHelper,
  ) {}

  /* @Post('signin')
  signin(@Body() userAuthCredentials: UserAuthCredentials) {
    if (userAuthCredentials.username === 'admin@dynsight.fr') {
      let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: 'Algeria',
          phone: '2135555555555',
          email: 'admin@dynsight.fr',
        },
        permissions: {
          role: 'admin',
          organization: 'string',
        },
      };

      return { token: jwt.sign(user, process.env.JWTSECRET), ...user };
    }
    if (userAuthCredentials.username === 'oo@dynsight.fr') {
      let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: 'Algeria',
          phone: '2135555555555',
          email: 'oo@dynsight.fr',
        },
        permissions: {
          role: 'organization-owner',
          organization: 'string',
        },
      };
      return { token: jwt.sign(user, 'mysecretkey'), ...user };
    }
    if (userAuthCredentials.username === 'co@dynsight.fr') {
      let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: 'Algeria',
          phone: '2135555555555',
          email: 'co@dynsight.fr',
        },
        permissions: {
          role: 'company-occupant',
          organization: 'string',
        },
      };
      return { token: jwt.sign(user, 'mysecretkey'), ...user };
    }
    throw new HttpException('Error whilre login', HttpStatus.FORBIDDEN);

    //return null
  } */
  @Post('signin')
  async signin(@Body() userAuthCredentials: UserAuthCredentials): Promise<any> {
    let user = await this.authenticationService.findOne(
      userAuthCredentials.username,
    );

    if (!user) {
      throw new HttpException(
        'Utilisateur non trouvé',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let checkPasswordHash = await this.passwordServiceHelper.checkPasswordHash(
      userAuthCredentials.password,
      user.authentication.password,
    );

    if (!checkPasswordHash) {
      throw new HttpException('Mauvais mot de passe', HttpStatus.UNAUTHORIZED);
    }

    return { token: jwt.sign(user, process.env.JWTSECRET), ...user };

    //return null
  }

  @Post('signup')
  signup() {
    return this.authenticationService.createOne();
  }
}
