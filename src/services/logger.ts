import { createLogger, transports, format, config } from 'winston'

let alignColorsAndLogs = format.combine(
  format.colorize({
    all: true,
  }),
  format.label({
    label: '[LOGGER]',
  }),
  format.printf(info => `${info.label} ${info.level} : ${info.message}`),
)

export const globalLogger = createLogger({
  transports: [new transports.Console({ format: alignColorsAndLogs, handleExceptions: true })],
})
