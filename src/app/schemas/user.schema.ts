/** @format */

import Joi from '@hapi/joi';
import MomentTZ from 'moment-timezone';

const validTimezones = MomentTZ.tz.names();
const UserRegisterSchema = Joi.object({
	name: Joi.string()
		.min(4)
		.max(20)
		.regex(/^[a-zA-Z ]*$/)
		.required(),

	email: Joi.string().email({ minDomainSegments: 2 }).required(),

	password: Joi.string()
		.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)
		.required(),

	username: Joi.string().min(5).max(20).required(),

	timezone: Joi.string()
		.valid(...Object.values(validTimezones))
		.required(),
});

const UserLoginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

const isEmailSchema = Joi.string().email({ minDomainSegments: 2 }).required();

export { UserLoginSchema, UserRegisterSchema, isEmailSchema };
