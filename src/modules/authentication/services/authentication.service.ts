import { UserAccount, UserAccountModel } from '@modules/user/models/user.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(UserAccount.name) private readonly userModel: UserAccountModel,
  ) {}

  async findOne(email: string): Promise<UserAccount | null> {
    try {
      let user = await this.userModel.findOne({
        'authentication.username': email,
      }).lean();
      
      if (user) {
        return user
      }
      
      return null;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données utilisateur',
      );
    }
  }

  async createOne() {
    let doc =  this.userModel.build({
      personalInformation: {
        firstName: 'user 1',
        lastName: 'last name 1',
      },
      contactInformation: {
        email: 'email@dynsight.com',
      },
      authentication: {
        username: 'email@dynsight.com',
        password:
          '$2b$10$jw9p2GsawKJOew49BFmYNOIYQ4DnghA68oxImkyMIl9F7G2vrY2qS',
      },
      permissions: {
        role: 'OO',
        organizationId: new mongoose.Types.ObjectId('6695701b4a5c208180bcfb0b'),
        buildingId: new mongoose.Types.ObjectId('6695701b4a5c208180bcfb0a'),
      },
    })
    doc.save()
    return doc
  }
}
