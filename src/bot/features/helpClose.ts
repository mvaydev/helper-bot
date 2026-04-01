import { Composer } from 'grammy'
import { MyContext } from '..'

const composer = new Composer<MyContext>()

composer.callbackQuery('help_close', async (ctx) => {
	await ctx.deleteMessage()
	await ctx.answerCallbackQuery()
})

export { composer as helpCloseFeature }
