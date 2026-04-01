import { Composer } from 'grammy'
import { MyContext } from '..'

const composer = new Composer<MyContext>()

composer.command('start', async (ctx) => {
	await ctx.reply(
		`<b>Добро пожаловать в бот-помощник! 👋</b>\n\n` +
			`Выберите команду из списка:\n` +
			`/help — Помощь по функция бота\n` +
			`/buttons — Добавить кнопки к сообщению\n`,
		{
			parse_mode: 'HTML',
		},
	)
})

export { composer as startFeature }
