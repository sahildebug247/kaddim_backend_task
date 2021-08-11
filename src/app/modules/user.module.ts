import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../db/schemas/user.schema';
import UserController from '../controllers/user.controller';
import UserPermissionService from '../services/perms/user-perms.service';
import UserService from '../services/user.service';
@Module({
	imports: [MongooseModule.forFeature([{ name: `user`, schema: UserSchema }])],
	exports: [UserService, UserPermissionService],
	providers: [UserService, UserPermissionService],
	controllers: [UserController],
})
export class UserModule {}
