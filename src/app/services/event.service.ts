/** @format */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import GenUtil from '../../util/gen.util';
import MomentUtil from '../../util/moment.util';
import { EventDocument } from '../../db/schemas/event.schema';
import Logger from '../../lib/Logger';
import ReturnVal from '../../lib/ReturnVal';
import EMessages from '../constants/messages.constant';
import { ESchemaDefaultInclude } from '../enum/schema-default-include.enum';
import IAuthDetail from '../interfaces/authdetail.interface';
import IPermsResponse from '../interfaces/perms-response.interface';
import ConfigService from './config.service';
import EventPermissionService from './perms/event-perms.service';
import UserService from './user.service';

const logger = new Logger('EventService');

@Injectable()
export default class EventService {
	constructor(
		@InjectModel(`event`) private readonly eventModel: Model<EventDocument>,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly permissionService: EventPermissionService
	) {}

	public async createEvent(userRegisterSchema: any, authDetail: IAuthDetail): Promise<ReturnVal> {
		const { city, country, description, address, contactEmail, date } = userRegisterSchema;

		const diff = await MomentUtil.timestampDiffInSeconds(date);

		if (!diff) {
			return ReturnVal.error(EMessages.INVALID_DATE, 400);
		}
		if (diff > -60) {
			return ReturnVal.error(
				EMessages.EVENT_DATE_TIME_SHOULD_BE_GREATER_THAN_CURRENT_TIME,
				400
			);
		}

		const createdEvent = new this.eventModel({
			city,
			country,
			description,
			address,
			contactEmail,
			date: new Date(date),
			//@ts-ignore
			createdBy: authDetail.currentUser.id,
		});

		try {
			await createdEvent.save();

			return ReturnVal.success(
				GenUtil.eventToJson(
					createdEvent,
					authDetail.currentUser.timezone,
					ESchemaDefaultInclude.EVENT_SCHEMA,
					[]
				),
				EMessages.EVENT_CREATED,
				201
			);
		} catch (e) {
			return ReturnVal.error(EMessages.INTERNAL_SERVER_ERROR, 500);
		}
	}

	public async inviteUserToEvent(
		{ userToInvite: userToInviteId, eventId },
		authDetail: IAuthDetail
	) {
		const permsRes: IPermsResponse = await this.permissionService.canInviteUsers(
			userToInviteId,
			eventId,
			authDetail,
			this.userService,
			this.eventModel
		);
		if (!permsRes.success) {
			return ReturnVal.error(permsRes.error, permsRes.httpCode);
		}
		const { event, userToInvite } = permsRes.data;

		const invitedUsers = event.invitedUsers;
		invitedUsers.push(userToInvite._id);
		const res = await this.eventModel.updateOne({ _id: eventId }, { invitedUsers });
		console.log(res);
		if (res.nModified) {
			return ReturnVal.success(
				GenUtil.eventToJson(
					event,
					authDetail.currentUser.timezone,
					ESchemaDefaultInclude.EVENT_SCHEMA,
					[]
				),
				EMessages.EVENT_UPDATED
			);
		}
	}

	public async getEvents(authDetail: IAuthDetail) {
		const { currentUser } = authDetail;
		const events = await this.eventModel
			.find(
				// @ts-ignore
				{ $or: [{ createdBy: currentUser }, { invitedUsers: [currentUser] }] }
			)
			.limit(+this.configService.getEntityFetchLimit())
			.exec();
		const eventJsonMap = [];

		for (const event of events) {
			eventJsonMap.push(
				GenUtil.eventToJson(
					event,
					currentUser.timezone,
					ESchemaDefaultInclude.EVENT_SCHEMA,
					[]
				)
			);
		}
		return ReturnVal.success(eventJsonMap, EMessages.RESOURCE_FOUND);
	}
}
