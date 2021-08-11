import Joi from '@hapi/joi';

import JoiObjectId from 'joi-oid';

const EventRegisterSchema = Joi.object({
	city: Joi.string().min(4).max(20).required(),
	country: Joi.string().min(4).max(20).required(),
	address: Joi.string().min(2).max(200).required(),
	description: Joi.string().min(10).max(2000).required(),
	contactEmail: Joi.string().email({ minDomainSegments: 2 }).required(),
	date: Joi.number().required(),
});

const EventUserInvitationSchemaSchema = JoiObjectId.object({
	userToInvite: JoiObjectId.objectId().required(),
	eventId: JoiObjectId.objectId().required(),
});
export { EventRegisterSchema, EventUserInvitationSchemaSchema };
