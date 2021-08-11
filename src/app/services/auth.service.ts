/** @format */

import { Injectable } from '@nestjs/common';
import JWT from 'jsonwebtoken';
import Logger from '../../lib/Logger';
import ReturnVal from '../../lib/ReturnVal';
import EMessages from '../constants/messages.constant';
import EUserStatus from '../enum/user.enum';
import ConfigService from './config.service';
import UserService from './user.service';

const logger = new Logger('AuthService');

@Injectable()
export default class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}

	public async validateJWTToken(jwtToken: string): Promise<ReturnVal> {
		try {
			const decoded: any = JWT.verify(jwtToken, this.configService.getJWTSecret());
			const { user_id } = decoded;
			const user = await this.userService.findOneById(user_id);
			if (!user) return ReturnVal.error(EMessages.INVALID_AUTHENTICATION_TOKEN);
			if (user.status !== EUserStatus.ACTIVE)
				return ReturnVal.error(EMessages.INACTIVE_USER_ACCOUNT);
			return ReturnVal.success(user);
		} catch (e) {
			return ReturnVal.error(EMessages.INVALID_AUTHENTICATION_TOKEN);
		}
	}
}
