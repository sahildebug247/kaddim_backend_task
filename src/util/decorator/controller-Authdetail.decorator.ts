import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { oc } from 'ts-optchain';
import IAuthDetail from '../../app/interfaces/authdetail.interface';
import EUserStatus from '../../app/enum/user.enum';

const AuthDetail = createParamDecorator((data: unknown, ctx: ExecutionContext): IAuthDetail => {
	const request = ctx.switchToHttp().getRequest();
	const user = request.user;
	const ip: string =
		oc(request).headers['x-forwarded-for']() || oc<any>(request).connection.remoteAddress('');
	const jwtToken = oc<any>(request).headers.authorization('');
	if (!user) {
		throw new UnauthorizedException();
	} else {
		if (user.status !== EUserStatus.ACTIVE) {
			throw new UnauthorizedException(`Your account is ${user.status}`);
		} else {
			return { currentUser: user, currentIp: ip, jwtToken, timezone: user.timezone };
		}
	}
});

export default AuthDetail;
