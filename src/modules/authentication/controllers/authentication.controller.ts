import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserAuthCredentials } from '../dtos/user-auth-credentials.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as jwt from 'jsonwebtoken';


@Controller('auth')
export class AuthenticationController {
  constructor() {}

  @Post('signin')
  signin(@Body() userAuthCredentials: UserAuthCredentials) {
    
    
    if(userAuthCredentials.username==="admin@dynsight.fr"){
      let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: "Algeria",
          phone: "2135555555555",
          email: "admin@dynsight.fr",
        },
        permissions: {
          role: 'admin',
          organization: 'string',
        },
      };
      
      return {token:jwt.sign(user, process.env.JWTSECRET),...user};
    }
    if(userAuthCredentials.username==="oo@dynsight.fr"){
      let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: "Algeria",
          phone: "2135555555555",
          email: "oo@dynsight.fr",
        },
        permissions: {
          role: 'organization-owner',
          organization: 'string',
        },
      };
      return {token:jwt.sign(user, 'mysecretkey'),...user};
    }
    if(userAuthCredentials.username==="co@dynsight.fr"){
       let user = {
        personalInformation: {
          firstName: 'oussama',
          lastName: 'benkemchi',
          gender: 'Male',
          dateOfBirth: '22-44-1904',
        },
        contactInformation: {
          address: "Algeria",
          phone: "2135555555555",
          email: "co@dynsight.fr",
        },
        permissions: {
          role: 'company-occupant',
          organization: 'string',
        },
      };
      return {token:jwt.sign(user, 'mysecretkey'),...user};
    }
    throw new HttpException("Error whilre login",HttpStatus.FORBIDDEN);
    
    
    
    //return null
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return { ...createUserDto };
  }
}
