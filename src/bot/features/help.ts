import { Composer } from 'grammy'
import { MyContext } from '..'
import { helpKeyboard } from '../keyboards/help'

const composer = new Composer<MyContext>()

composer.command('help', async (ctx) => {
	await ctx.reply(
		'💡 <b>Помощь</b>\n\n Выберите команду, для которой нужна справка',
		{
			reply_markup: helpKeyboard,
			parse_mode: 'HTML',
		},
	)
})

export { composer as helpFeature }
