import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Adds color to the logs
      translateTime: 'SYS:standard', // Formats the timestamp
      ignore: 'pid,hostname', // Hides unnecessary fields
      levelFirst: true, // Displays the log level first
    },
  },
});

export default logger;