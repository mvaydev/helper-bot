import { Composer } from 'grammy'
import { MyContext } from '..'
import { helpCloseKeyboard } from '../keyboards/helpClose'

const composer = new Composer<MyContext>()

composer.callbackQuery('help_buttons', async (ctx) => {
	await ctx.reply(
		`Функция добавляет к сообщению ссылки в виде кнопок снизу и самостоятельно отправляет в канал\n\n` +
			`Для этого отправьте боту сообщение, к которому нужно добавить кнопки и укажите до 8 ссылок. После этого отправьте боту канал, в котором нужно сделать пост\n\n` +
			`<b>❗ Важно! Вы и бот должны быть администраторами данного канала</b>`,
		{
			parse_mode: 'HTML',
			reply_markup: helpCloseKeyboard,
		},
	)
	await ctx.answerCallbackQuery()
})

export { composer as helpButtonsFeature }
