import { config } from '#root/config'
import { pino } from 'pino'

export const logger = pino({
	transport: {
		targets: [
			...(config.DEBUG
				? [
						{
							target: 'pino-pretty',
							options: {
								ignore: 'pid,hostname',
								colorize: true,
								translateTime: true,
							},
						},
					]
				: [
						{
							target: 'pino/file',
							options: {
								destination: './logs/app.log',
								mkdir: true,
							},
						},
					]),
		],
	},
})

export type Logger = typeof logger
