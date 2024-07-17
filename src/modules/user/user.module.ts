import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserServiceHelper } from './services/user-helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccount, UserSchema } from './models/user.model';
import { PasswordServiceHelper } from './services/password-helper.service';
import { Admin, AdminSchema } from './models/admin.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserAccount.name,
        schema: UserSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserServiceHelper,PasswordServiceHelper],
  exports:[UserService]
})
export class UserModule {}
