import { config } from '#root/config'
import { logger } from '#root/logger'
import { ConversationFlavor } from '@grammyjs/conversations'
import { Bot, Context } from 'grammy'
import { startFeature } from './features/start'
import { errorHandlingMiddleware } from './midddlewares/error'

export type MyContext = ConversationFlavor<Context>

const bot = new Bot<MyContext>(config.BOT_TOKEN)

// Error handling
bot.catch(errorHandlingMiddleware)

// Handlers
bot.use(startFeature)

export async function startPolling() {
	logger.info('Polling started')
	await bot.start()
}
