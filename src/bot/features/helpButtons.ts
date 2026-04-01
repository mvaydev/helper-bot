import { Composer } from 'grammy'
import { MyContext } from '..'

const composer = new Composer<MyContext>()

composer.callbackQuery('help_buttons', async (ctx) => {
	await ctx.reply(
		`Функция добавляет к сообщению ссылки в виде кнопок снизу и самостоятельно отправляет в канал.\n\n` +
			`Для этого отправьте боту сообщение, к которому нужно добавить кнопки и укажите сами ссылки, после отправьте <b>ID</b> канала, в который нужно отправить сообщение\n\n` +
			`<b>❗ Важно! Вы и бот должны быть администраторами данного канала</b>`,
		{
			parse_mode: 'HTML',
		},
	)
	await ctx.answerCallbackQuery()
})

export { composer as helpButtonsFeature }
