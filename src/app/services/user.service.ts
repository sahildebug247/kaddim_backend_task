/** @format */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import BCrypt, * as Bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { User, UserDocument } from '../../db/schemas/user.schema';
import Logger from '../../lib/Logger';
import ReturnVal from '../../lib/ReturnVal';
import GenUtil from '../../util/gen.util';
import EMessages from '../constants/messages.constant';
import { ESchemaDefaultInclude } from '../enum/schema-default-include.enum';
import EUserStatus from '../enum/user.enum';
import IAuthDetail from '../interfaces/authdetail.interface';
import IPermsResponse from '../interfaces/perms-response.interface';
import IUserLoginResponse from '../interfaces/user-login.interface';
import ConfigService from './config.service';
import UserPermissionService from './perms/user-perms.service';

const logger = new Logger('UserService');

@Injectable()
export default class UserService {
	constructor(
		@InjectModel(`user`) private readonly userModel: Model<UserDocument>,
		private readonly permissionService: UserPermissionService,
		private readonly configService: ConfigService
	) {}

	public async register(userRegisterSchema: any): Promise<ReturnVal> {
		const { name, email, password, username, timezone } = userRegisterSchema;

		const permsRes: IPermsResponse = await this.permissionService.canRegisterUser(
			username,
			email,
			this.userModel
		);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}
		const passHash = Bcrypt.hashSync(password, 10); // Hash password

		const createdUser = new this.userModel({
			name,
			email,
			username,
			password: passHash,
			timezone,
		});

		try {
			await createdUser.save();
			return ReturnVal.success(EMessages.USER_REGISTERED, '', 201);
		} catch (e) {
			logger.error(`${EMessages.USER_REGISTRATION_FAILED}, e: ${e.message}`);
			return ReturnVal.error(EMessages.USER_REGISTRATION_FAILED, 400);
		}
	}

	public async findOneById(id) {
		return this.userModel.findById(id).exec();
	}

	public async findOneByUsername(username: string) {
		return this.userModel
			.findOne({
				username: username.toLowerCase(),
			})
			.exec();
	}

	public async login({ username, password }): Promise<ReturnVal<IUserLoginResponse>> {
		const userEntity = await this.userModel
			.findOne({
				username: username.toLowerCase(),
			})
			.exec();
		const permsRes: IPermsResponse = await this.permissionService.canUserLogin(userEntity);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}

		try {
			const isMatching = await BCrypt.compare(password, userEntity.password);
			if (isMatching) {
				const token = await this.generateJWTToken(userEntity);
				userEntity.lastLogin = new Date();
				await userEntity.save();
				return ReturnVal.success(
					{
						token,
						user: {
							email: userEntity.email,
							id: userEntity.id,
							name: userEntity.name,
							username: userEntity.username,
							timezone: userEntity.timezone,
						},
					},
					EMessages.USER_LOGGED_ID,
					201
				);
			}

			return ReturnVal.error(EMessages.INVALID_CREDENTIALS, 401);
		} catch (e) {
			logger.error(`Error occurred while logging user in, e: ${e.message}`);
		}
	}

	public async getMe(authDetail: IAuthDetail): Promise<ReturnVal<Partial<User>>> {
		console.log();
		return ReturnVal.success(
			GenUtil.userToJson(
				authDetail.currentUser,
				authDetail.currentUser.timezone,
				ESchemaDefaultInclude.USER_SCHEMA,
				[]
			),
			EMessages.RESOURCE_FOUND,
			200
		);
	}

	private async generateJWTToken(user: User) {
		const payload = {
			user_id: user.id,
			random: uuidV4,
		};
		return JWT.sign(payload, this.configService.getJWTSecret(), {
			expiresIn: this.configService.getJwtExpiresIn(),
		});
	}

	private static async getFilters(
		nameFilter: string,
		statusFilter: EUserStatus
	): Promise<object> {
		const filters = {};

		if (statusFilter) {
			filters['status'] = statusFilter;
		}
		return filters;
	}
}
