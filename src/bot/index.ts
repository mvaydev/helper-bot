import { config } from '#root/config'
import { logger } from '#root/logger'
import {
	ConversationFlavor,
	conversations,
	createConversation,
} from '@grammyjs/conversations'
import { Bot, Context } from 'grammy'
import { startFeature } from './features/start'
import { errorHandlingMiddleware } from './midddlewares/error'
import { buttonsFeature } from './features/buttons'
import { conversationButtons } from './conversations/buttons'
import { helpFeature } from './features/help'
import { helpButtonsFeature } from './features/helpButtons'
import { helpCloseFeature } from './features/helpClose'

export type MyContext = ConversationFlavor<Context>

const bot = new Bot<MyContext>(config.BOT_TOKEN)

bot.use(conversations())
bot.catch(errorHandlingMiddleware)

bot.use(createConversation(conversationButtons, 'buttons'))

// Handlers
bot.use(startFeature)
bot.use(buttonsFeature)

bot.use(helpFeature)
bot.use(helpButtonsFeature)
bot.use(helpCloseFeature)

export async function startPolling() {
	logger.info('Polling started')
	await bot.start()
}
