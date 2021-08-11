/** @format */

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../../db/schemas/user.schema';
import AuthDetail from '../../util/decorator/controller-Authdetail.decorator';
import ReturnVal from '../../lib/ReturnVal';
import HandleReturnVal from '../../util/decorator/handle-returnval.decorator';
import AuthenticationGuard from '../guards/authentication.guard';
import IAuthDetail from '../interfaces/authdetail.interface';
import IUserLoginResponse from '../interfaces/user-login.interface';
import ValidationPipe from '../pipes/validation.pipe';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import UserService from '../services/user.service';
@Controller('user')
export default class UserController {
	constructor(private readonly userService: UserService) {}
	/*
  Get Routes

  */

	@Get('me')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async getMe(@AuthDetail() authDetail: IAuthDetail): Promise<ReturnVal<Partial<User>>> {
		return this.userService.getMe(authDetail);
	}

	/*
  		Post Routes
  */
	@Post('login')
	@HandleReturnVal
	public async login(
		@Body(new ValidationPipe(UserLoginSchema)) userLoginSchema
	): Promise<ReturnVal<IUserLoginResponse>> {
		return this.userService.login(userLoginSchema);
	}

	@Post('')
	@HandleReturnVal
	public async register(
		@Body(new ValidationPipe(UserRegisterSchema)) userRegisterSchema
	): Promise<ReturnVal> {
		return this.userService.register(userRegisterSchema);
	}
}
