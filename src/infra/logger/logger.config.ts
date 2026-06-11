import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const isDev = process.env.NODE_ENV !== 'production';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        isDev
          ? nestWinstonModuleUtilities.format.nestLike('Library', {
              prettyPrint: true,
              colors: true,
            })
          : winston.format.json(),
      ),
    }),
  ],
};
