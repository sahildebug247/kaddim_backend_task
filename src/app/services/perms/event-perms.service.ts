/** @format */

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import IAuthDetail from '../../../app/interfaces/authdetail.interface';
import { EventDocument } from '../../../db/schemas/event.schema';
import EUserStatus from '../../../app/enum/user.enum';
import EMessages from '../../constants/messages.constant';
import IPermsResponse from '../../interfaces/perms-response.interface';
import UserService from '../user.service';

@Injectable()
class EventPermissionService {
	public async canInviteUsers(
		userToInviteId: string,
		eventId: string,
		authDetail: IAuthDetail,
		userService: UserService,
		eventModel: Model<EventDocument>
	): Promise<IPermsResponse> {
		const event = await eventModel.findById(eventId).exec();
		if (!event) {
			return {
				success: false,
				error: EMessages.INVALID_EVENT_ID,
				httpCode: 400,
			};
		}
		// @ts-ignore
		if (!event.createdBy.equals(authDetail.currentUser._id)) {
			return {
				success: false,
				error: EMessages.UNAUTHORIZED_ACCESS,
				httpCode: 403,
			};
		}
		const userToInvite = await userService.findOneById(userToInviteId);
		if (!userToInvite || userToInvite.status !== EUserStatus.ACTIVE) {
			return {
				success: false,
				error: EMessages.INVALID_USER_ID,
				httpCode: 400,
			};
		}

		// @ts-ignore
		if (userToInvite._id.equals(event.createdBy._id)) {
			return {
				success: false,
				error: EMessages.EVENT_OWNER_INVITE_CONFLICT,
				httpCode: 400,
			};
		}
		for (const invitedUser of event.invitedUsers) {
			// @ts-ignore
			if (userToInvite._id.equals(invitedUser)) {
				return {
					success: false,
					error: EMessages.USER_ALREADY_INVITED,
					httpCode: 400,
				};
			}
		}
		return {
			success: true,
			error: '',
			httpCode: 0,
			data: {
				event,
				userToInvite,
			},
		};
	}
}

export default EventPermissionService;
