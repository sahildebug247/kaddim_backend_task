import winston, { format, Logger as ImportedLogger, LoggerOptions, transports } from 'winston';
import * as path from 'path';
import morgan from 'morgan';
import { Request, RequestHandler, Response } from 'express';
import _ from 'lodash';
import { EOL } from 'os';

const { printf } = format;

export default class Logger {
  public static DEFAULT_CONTEXT = 'app';
  private static _logger: ImportedLogger;
  private static readonly customFormat = printf((info) => {
    const { timestamp, ...meta } = info.metadata;
    const objs = Object.values(meta);
    return `${timestamp} ${info.level}: ${info.message} ${Logger.isBlank(objs) ? '' : objs.map(m => JSON.stringify(m, null, 2)).join(' ')}`;
  });
  public static loggerOptions: LoggerOptions = {
    transports: [new transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      handleExceptions: true,
      format: process.env.NODE_ENV !== 'production' ? format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.metadata(),
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        Logger.customFormat,
      ) : winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    })],
  };
  private readonly context: string;

  constructor(context?: string) {
    this.context = Logger.parsePathToContext((context) ? context : Logger.DEFAULT_CONTEXT);
  }

  public static logger(): ImportedLogger {
    if (!Logger._logger) {
      Logger._logger = winston.createLogger(Logger.loggerOptions);
    }

    return Logger._logger;
  }

  private static parsePathToContext(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
    }
    return filepath;
  }

  private static isBlank(value) {
    return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value);
  }

  public error(message: string, trace?: string, ...meta: any[]) {
    Logger.logger().error(`[${this.context}] ${message} ${EOL} ${trace}`, meta);
  }

  public debug(message: string, ...meta: any[]) {
    Logger.logger().debug(`[${this.context}] ${message}`, meta);
  }

  // override that nestjs logger.service calls
  public log(message: string, context: string, isTimestampEnabled?: boolean) {
    Logger.logger().log('info', `[${context || this.context}] ${message}`);
  }

  public info(message: string, ...meta: any[]) {
    Logger.logger().info(`[${this.context}] ${message}`, meta);
  }

  public warn(message: string, ...meta: any[]) {
    Logger.logger().warn(`[${this.context}] ${message}`, meta);
  }

  public logInfo(): RequestHandler {
    return morgan(this.morganFormat(), {
      skip: (req: Request, res: Response) => res.statusCode >= 400,
      stream: {
        write: (text: string) => {
          Logger.logger().info(`[Request] ${text.trim()}`);
        },
      },
    });
  }

  public logError(): RequestHandler {
    return morgan(this.morganFormat(), {
      skip: (req: Request, res: Response) => res.statusCode < 400,
      stream: {
        write: (text: string) => {
          Logger.logger().error(`[Request] ${text.trim()}`);
        },
      },
    });
  }

  private morganFormat(): string {
    const fmt = process.env.NODE_ENV !== 'production' ?
      'dev' :
      ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
    return process.env.LOG_HTTP_FORMAT || fmt;
  }
}
