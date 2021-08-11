/** @format */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IsEmail, IsIn, IsString } from 'class-validator';

import EUserStatus from '../../app/enum/user.enum';
import ModelSchema from './model.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends ModelSchema<User> {
	@IsEmail()
	@Prop({ trim: true, lowercase: true, unique: true, required: true })
	public email: string;

	@IsString()
	@Prop({ required: true })
	public password: string;

	@IsString()
	@Prop({ trim: true, required: true })
	public name: string;

	@IsString()
	@Prop({ trim: true, lowercase: true, unique: true, required: true })
	public username: string;

	@IsString()
	@Prop({ type: Date })
	public lastLogin: Date;

	@IsString()
	@Prop({ trim: true, required: true })
	public timezone: string;

	@IsIn(Object.values(EUserStatus))
	@Prop({ enum: EUserStatus, default: EUserStatus.ACTIVE })
	public status: EUserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
