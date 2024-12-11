import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthCredentials, UserSingedinDto } from '../dtos/user-authentication.dto';
import * as jwt from 'jsonwebtoken';
import { AuthenticationService } from '../services/authentication.service';
import { PasswordServiceHelper } from '../services/password-helper.service';
import { CreateUserDocumentAttrsDto } from '@modules/shared/dto/user/create-user.dto';
import { UserSharedService } from '@modules/shared/services/user.shared.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userSharedService:UserSharedService,
    private readonly passwordServiceHelper: PasswordServiceHelper,
  ) {}

  @Post('signin')
  /* signin(@Body() userAuthCredentials: UserAuthCredentials) {
    console.log(userAuthCredentials);
    
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
  async signin(@Body() userAuthCredentials: UserAuthCredentials): Promise<UserSingedinDto> {
    
    let users = await this.userSharedService.findMany({
      'authentication.username': userAuthCredentials.username,
    });

    
    
    if (users.length===0) {
      throw new HttpException(
        'Utilisateur non trouvé',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let checkPasswordHash = await this.passwordServiceHelper.checkPasswordHash(
      userAuthCredentials.password,
      users[0].authentication.password,
    );
    
    
    if (!checkPasswordHash) {
      throw new HttpException('Mauvais mot de passe', HttpStatus.UNAUTHORIZED);
    }

    return { token: jwt.sign(users[0], process.env.JWTSECRET), ...users[0] };

    //return null
  }

  @Post('signup')
  async signup(@Body() createUserDto:CreateUserDocumentAttrsDto) {
    try {
      let user = await this.authenticationService.createOne(createUserDto);
      return user

    } catch (error) {
      throw new HttpException("Erreur lors de la création du compte",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
