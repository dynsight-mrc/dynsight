import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccount, UserSchema } from '@modules/user/models/user.model';
import { PasswordServiceHelper } from './services/password-helper.service';
import { AuthenticationService } from './services/authentication.service';
import { User, UserSchema2 } from './models/user.model';
import { UserSharedService } from '@modules/shared/services/user.shared.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserAccount.name,
        schema: UserSchema,
      },
      {
        name: User.name,
        schema: UserSchema2,
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,PasswordServiceHelper,UserSharedService],
})
export class AuthenticationModule {}
