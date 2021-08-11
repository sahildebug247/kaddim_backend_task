/** @format */

import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import Logger from '../../lib/Logger';
import IEnvConfigInterface from '../interfaces/env-config.interface.ts';
const logger = new Logger('ConfigService');

@Injectable()
class ConfigService {
	private readonly envConfig: IEnvConfigInterface;

	constructor(filePath: string) {
		const config = dotenv.parse(fs.readFileSync(filePath));
		logger.info(`NODE_ENV = ${process.env.NODE_ENV}, envfile = ${filePath}`);
		this.envConfig = this.validateInput(config);
	}

	private get(key: string): string {
		return this.envConfig[key];
	}

	public getMongooseConfig(): MongooseModuleOptions {
		const uri: any = this.envConfig.MONGO_URI;
		return {
			uri,
			useCreateIndex: true,
		};
	}

	/*
	  Ensures all needed variables are set, and returns the validated JavaScript object
	  including the applied default values.
  */
	private validateInput(envConfig: IEnvConfigInterface): IEnvConfigInterface {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NODE_ENV: Joi.string()
				.valid('development', 'production', 'test')
				.default('development'),
			HTTP_PORT: Joi.number().required(),
		}).unknown(true);

		const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
		if (error) {
			throw new Error(`Config validation error: ${error.message}`);
		}
		return validatedEnvConfig;
	}

	public getJwtExpiresIn(): string {
		return this.get('JWT_EXPIRES_IN');
	}

	public getEntityFetchLimit(): string {
		return this.get('ENTITY_FETCH_LIMIT');
	}

	public getJWTSecret(): string {
		return this.get('JWT_SECRET');
	}
}

export default ConfigService;
