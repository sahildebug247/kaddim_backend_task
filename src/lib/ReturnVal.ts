import EMessages from '../app/constants/messages.constant';

export default class ReturnVal<T = any> {
	public success: boolean;
	public message: string;
	public data: T;
	public httpCode?: number;

	constructor(success: boolean, message: string, httpCode: number, data?: T) {
		this.success = success;
		this.message = message;
		this.data = data;
		if (httpCode) {
			this.httpCode = httpCode;
		} else {
			this.httpCode = success ? 200 : ReturnVal.getErrorHttpCode(this.message);
		}
	}

	public static success<T>(data?: T, message?: string, httpCode?: number): ReturnVal<T> {
		if (!message) {
			message = 'Successful';
		}
		return new ReturnVal<T>(true, message, httpCode, data);
	}

	public static error(message?: string, httpCode?: number): ReturnVal {
		if (!message) {
			message = 'Error Occurred';
		}
		return new ReturnVal(false, message, httpCode);
	}

	public static unauthorizedAccess() {
		return new ReturnVal(false, EMessages.UNAUTHORIZED_ACCESS, null, 401);
	}

	public static permissionDenied() {
		return new ReturnVal(false, EMessages.PERMISSION_DENIED, null, 403);
	}

	public static resourceNotFoundError() {
		return new ReturnVal(false, EMessages.RESOURCE_NOT_FOUND, null, 404);
	}

	public static getErrorHttpCode(message): number {
		if (message === EMessages.UNAUTHORIZED_ACCESS) {
			return 401;
		}
		if (message === EMessages.RESOURCE_NOT_FOUND) {
			return 404;
		}

		return 400;
	}
}
