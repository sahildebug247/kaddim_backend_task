/** @format */

import { User } from '../../db/schemas/user.schema';

export default interface IAuthDetail {
	currentUser: User;
	currentIp: string;
	jwtToken: string;
	timezone: string;
}
