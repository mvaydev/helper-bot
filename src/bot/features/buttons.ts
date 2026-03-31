import { Composer } from 'grammy'
import { MyContext } from '..'

const composer = new Composer<MyContext>()

composer.command('buttons', async (ctx) => {
	await ctx.conversation.enter('buttons')
})

export { composer as buttonsFeature }
