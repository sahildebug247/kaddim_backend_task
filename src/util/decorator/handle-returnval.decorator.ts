import ReturnVal from '../../lib/ReturnVal';
import { HttpException } from '@nestjs/common';

function HandleReturnVal(target: any, propertyName: string, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args) {
    const retVal: ReturnVal = await originalMethod.call(this, ...args);

    if (retVal.success) {
      return { message: retVal.message, data: retVal.data };
    } else {
      throw new HttpException(retVal.message, retVal.httpCode);
    }
  };
  return descriptor;

}

export default HandleReturnVal;
