import { Composer } from 'grammy'
import { MyContext } from '..'

const composer = new Composer<MyContext>()

composer.command('start', async (ctx) => {
	return ctx.reply('welcome')
})

export { composer as startFeature }
