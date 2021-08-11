import * as path from 'path';
import Logger from '../lib/Logger';
const env = process.env.NODE_ENV || 'development';
const p = path.join(process.cwd(), `env/${env}.env`);

const logger = new Logger('Main');

logger.info(`Loading env from ${p}`);

const dotEnvOptions = {
  path: p,
};

export { dotEnvOptions };
