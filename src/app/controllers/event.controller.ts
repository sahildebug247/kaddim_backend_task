/** @format */

import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import ReturnVal from '../../lib/ReturnVal';
import AuthDetail from '../../util/decorator/controller-Authdetail.decorator';
import HandleReturnVal from '../../util/decorator/handle-returnval.decorator';
import AuthenticationGuard from '../guards/authentication.guard';
import IAuthDetail from '../interfaces/authdetail.interface';
import ValidationPipe from '../pipes/validation.pipe';
import { EventRegisterSchema, EventUserInvitationSchemaSchema } from '../schemas/event.schema';
import EventService from '../services/event.service';
@Controller('event')
export default class EventController {
	constructor(private readonly eventService: EventService) {}

	/*
 	 Post Routes

  */
	@Get('')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async getEvents(@AuthDetail() authDetail: IAuthDetail): Promise<ReturnVal> {
		return this.eventService.getEvents(authDetail);
	}

	/*
 	 Post Routes

  */
	@Post('')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async createEvent(
		@Body(new ValidationPipe(EventRegisterSchema)) payload,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<Event>>> {
		return this.eventService.createEvent(payload, authDetail);
	}

	/*
  Put Routes

  */
	@Put('invite')
	@UseGuards(AuthenticationGuard)
	@HandleReturnVal
	public async inviteUserToEvent(
		@Body(new ValidationPipe(EventUserInvitationSchemaSchema)) payload,
		@AuthDetail()
		authDetail: IAuthDetail
	): Promise<ReturnVal<Partial<Event>>> {
		return this.eventService.inviteUserToEvent(payload, authDetail);
	}
}
