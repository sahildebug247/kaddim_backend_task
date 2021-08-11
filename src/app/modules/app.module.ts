/** @format */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ConfigService from '../services/config.service';
import AuthModule from './auth.module';
import ConfigModule from './config.module';
import { EventModule } from './event.module';
import { UserModule } from './user.module';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forRootAsync({
			useFactory: (config: ConfigService) => {
				return config.getMongooseConfig();
			},
			inject: [ConfigService],
		}),
		AuthModule,
		EventModule,
		UserModule,
	],
	providers: [],
	exports: [],
})
export class AppModule {}
