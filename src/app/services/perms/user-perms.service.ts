/** @format */

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import EUserStatus from '../../../app/enum/user.enum';
import { User, UserDocument } from '../../../db/schemas/user.schema';
import EMessages from '../../constants/messages.constant';
// import UserEntity from '../../../db/entities/user.entity';
import IPermsResponse from '../../interfaces/perms-response.interface';

@Injectable()
class UserPermissionService {
	public async canRegisterUser(
		username: string,
		email: string,
		userModel: Model<UserDocument>
	): Promise<IPermsResponse> {
		const user = await userModel.findOne({ $or: [{ username }, { email }] }).exec();
		if (user) {
			return {
				success: false,
				error: EMessages.EMAIL_OR_USERNAME_ALREADY_EXISTS,
				httpCode: 400,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
	public async canUserLogin(user: User): Promise<IPermsResponse> {
		if (!user) {
			return {
				success: false,
				error: EMessages.INVALID_CREDENTIALS,
				httpCode: 401,
			};
		}
		if (user.status !== EUserStatus.ACTIVE) {
			return {
				success: false,
				error: EMessages.INACTIVE_USER_ACCOUNT,
				httpCode: 401,
			};
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
		};
	}
}

export default UserPermissionService;
