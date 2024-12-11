import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PasswordServiceHelper } from './password-helper.service';
import { CreateUserDocumentAttrsDto } from '@modules/shared/dto/user/create-user.dto';
import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
    private readonly passwordServiceHelper: PasswordServiceHelper,
  ) {}

  async findOne(email: string): Promise<UserAccount | null> {
    try {
      let user = await this.userModel
        .findOne({
          'authentication.username': email,
        })
        .lean();

      if (user) {
        return user;
      }

      return null;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données utilisateur',
      );
    }
  }

  async createOne(
    createUserDto: CreateUserDocumentAttrsDto,
  ): Promise<ReadUserDocumentDto> {
    let passwordHash = await this.passwordServiceHelper.createPasswordHash(
      createUserDto.authentication.password,
    );
    let newAuthentication = {
      username: createUserDto.authentication.username,
      password: passwordHash,
    };
    createUserDto.authentication = newAuthentication;
    try {
      let doc = this.userModel.build(createUserDto);
      await doc.save();
      return doc as undefined as ReadUserDocumentDto;
    } catch (error) {
      console.log(error);
    }
  }
}
