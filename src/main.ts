import { startPolling } from './bot'
import { logger } from './logger'

async function bootstrap() {
	await startPolling()

	onShutdown(async () => {
		logger.info('Shutdown')
	})
}

function onShutdown(cleanUp: () => Promise<void>) {
	let isShuttingDown = false
	const handleShutdown = async () => {
		if (isShuttingDown) return
		isShuttingDown = true
		await cleanUp()
	}
	process.on('SIGINT', handleShutdown)
	process.on('SIGTERM', handleShutdown)
}

bootstrap().catch((error) => {
	logger.error(error)
	process.exit(1)
})
