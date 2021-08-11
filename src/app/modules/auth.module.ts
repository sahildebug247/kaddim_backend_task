import { Global, Module } from '@nestjs/common';
import AuthenticationGuard from '../guards/authentication.guard';
import AuthService from '../services/auth.service';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
	imports: [AuthenticationGuard, UserModule],
	providers: [AuthService],
	exports: [AuthService, AuthenticationGuard],
})
export default class AuthModule {}
