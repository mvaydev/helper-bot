import { Conversation } from '@grammyjs/conversations'
import { Context, InlineKeyboard, Keyboard } from 'grammy'

export async function conversationButtons(conversation: Conversation, ctx: Context) {
	await ctx.reply('Отправьте сообщение, к которому нужно добавить кнопки 👇')
	const msgCtx = await conversation.waitFor('message')

	const buttons: {
		text: string
		url: string
	}[] = []

	for (let count = 0; count < 8; count++) {
		const STOP_TEXT = '✅ Завершить редактирование'
		const stopKeyboard = new Keyboard().text(STOP_TEXT).resized().oneTime()

		// Text
		await ctx.reply(`✏️ Отправьте текст для кнопки <b>${count + 1}</b>`, {
			reply_markup: count ? stopKeyboard : undefined,
			parse_mode: 'HTML',
		})
		const { message: btnTextMsg } = await conversation.waitForHears(
			/^.{1,100}$/,
			{
				otherwise: async (ctx) => {
					await ctx.reply(
						'Текст не подходит, введите ещё раз (макс. 100 символов)',
					)
				},
			},
		)
		if (btnTextMsg?.text === STOP_TEXT) break

		// URL
		await ctx.reply(`🔗 Отправьте ссылку для кнопки <b>${count + 1}</b>`, {
			reply_markup: count ? stopKeyboard : undefined,
			parse_mode: 'HTML',
		})
		const { message: btnUrlMsg } = await conversation.waitFor('::url', {
			otherwise: async (ctx) => {
				await ctx.reply('Это не похоже на ссылку, введите ещё раз')
			},
		})
		if (btnUrlMsg?.text === STOP_TEXT) break

		buttons[count] = {
			text: btnTextMsg?.text || 'Ссылка',
			url: btnUrlMsg?.text || 'https://google.com',
		}
	}

	if (!buttons.length) {
		await ctx.reply('⚠ Ни одной кнопки не было добавлено')
		return
	}

	const keyboard = InlineKeyboard.from(
		buttons.map(({ text, url }) => [InlineKeyboard.url(text, url)]),
	)
	msgCtx.copyMessage(msgCtx.chatId, {
		reply_markup: keyboard,
	})
}
