/** @format */

import { Prop } from '@nestjs/mongoose';

export default class ModelSchema<T extends ModelSchema<T>> {
	@Prop({ name: '_id' })
	public id: string;

	@Prop()
	public createdAt: Date;

	@Prop()
	public updatedAt: Date;
}
