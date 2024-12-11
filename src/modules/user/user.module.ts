import { Module } from '@nestjs/common';
import { UserServiceHelper } from './services/user-helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccount, UserSchema } from './models/user.model';
import { PasswordServiceHelper } from '../shared/services/password-helper.service';
import { Admin, AdminSchema } from './models/admin.model';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';

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
  controllers: [UsersController],
  providers: [UserService,UsersService, UserServiceHelper,PasswordServiceHelper],
  exports:[UserService]
})
export class UserModule {}
