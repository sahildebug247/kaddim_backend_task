import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from '../../db/schemas/event.schema';
import EventController from '../controllers/event.controller';
import EventService from '../services/event.service';
import EventPermissionService from '../services/perms/event-perms.service';
import { UserModule } from './user.module';
@Module({
	imports: [
		MongooseModule.forFeature([{ name: `event`, schema: EventSchema }]),
		UserModule,
		EventPermissionService,
	],
	providers: [EventService, EventPermissionService],
	controllers: [EventController],
})
export class EventModule {}
