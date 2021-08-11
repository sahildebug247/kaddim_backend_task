import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from '@hapi/joi';

@Injectable()
export default class ArrayValidationPipe implements PipeTransform<any> {
  constructor(private readonly schema: Joi.ArraySchema) {
  }

  public transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessages: string[] = [];
      for (const detail of details) {
        errorMessages.push(detail.message);
      }
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
