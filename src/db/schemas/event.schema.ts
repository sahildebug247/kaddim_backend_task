/** @format */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsString } from 'class-validator';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import ModelSchema from './model.schema';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event extends ModelSchema<Event> {
	@IsString()
	@Prop({ trim: true, required: true })
	public city: string;

	@IsString()
	@Prop({ trim: true, required: true })
	public country: string;

	@IsString()
	@Prop({ trim: true, required: true })
	public description: string;

	@IsString()
	@Prop({ trim: true, required: true })
	public address: string;

	@IsEmail()
	@Prop({ trim: true, required: true })
	public contactEmail: string;

	@IsEmail()
	@Prop({ type: Date, trim: true, required: true })
	public date: Date;

	@IsString()
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true })
	public createdBy: User;

	@IsString()
	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', default: [] }])
	public invitedUsers: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
