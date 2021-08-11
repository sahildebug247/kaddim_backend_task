/** @format */

import { NestFactory } from '@nestjs/core';
import Helmet from 'helmet';
import { AppModule } from './modules/app.module';
import express from 'express';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('/api/v1');

	app.use(Helmet());

	app.enableCors();
	app.use(
		express.json({
			limit: '20mb',
		})
	);
	app.use(
		express.urlencoded({
			limit: '20mb',
			extended: true,
		})
	);
	// app.use(
	//     RateLimit({
	//       windowMs: 15 * 60 * 1000, // 15 minutes
	//       max: 100, // limit each IP to 100 requests per windowMs
	//     }),
	// );
	const port = process.env.PORT || 3001;
	await app.listen(port);
}

bootstrap();
