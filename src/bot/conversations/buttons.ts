import { config } from '#root/config.js'
import { Conversation } from '@grammyjs/conversations'
import { Context, InlineKeyboard, Keyboard } from 'grammy'

export async function conversationButtons(conversation: Conversation, ctx: Context) {
	await ctx.reply('Отправьте сообщение, к которому нужно добавить кнопки 👇')
	const msgCtx = await conversation.waitFor('message')

	// Create buttons

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

	// Request channel

	const requestChannelsKeyboard = new Keyboard()
		.requestChat('📢 Выбрать канал', 1, {
			chat_is_channel: true,
			user_administrator_rights: {
				is_anonymous: false,
				can_manage_chat: true,
				can_delete_messages: false,
				can_manage_video_chats: false,
				can_restrict_members: false,
				can_promote_members: false,
				can_change_info: false,
				can_invite_users: false,
				can_post_stories: false,
				can_edit_stories: false,
				can_delete_stories: false,
				can_post_messages: true,
			},
			bot_administrator_rights: {
				is_anonymous: false,
				can_manage_chat: true,
				can_delete_messages: false,
				can_manage_video_chats: false,
				can_restrict_members: false,
				can_promote_members: false,
				can_change_info: false,
				can_invite_users: false,
				can_post_stories: false,
				can_edit_stories: false,
				can_delete_stories: false,
				can_post_messages: true,
			},
			bot_is_member: true,
		})
		.oneTime()
		.resized()
	await ctx.reply('📰 Выберите канал для отправки', {
		reply_markup: requestChannelsKeyboard,
	})
	const { message: channelIdMsg } = await conversation.waitFor(':chat_shared', {
		otherwise: async (ctx) =>
			await ctx.reply('Это не похоже на канал, отправьте ещё раз'),
	})

	const channelId = channelIdMsg?.chat_shared.chat_id!
	let channelAdmins

	try {
		channelAdmins = await ctx.api.getChatAdministrators(channelId)
	} catch (error) {
		await ctx.reply('⚠ Канал не найден')
		return
	}

	const userId = ctx.from?.id!

	// Sending post

	if (channelAdmins.map((member) => member.user.id).includes(userId)) {
		try {
			await msgCtx.copyMessage(ctx.chatId!, {
				reply_markup: keyboard,
			})
			const CONFIRM_TEXT = '✅ Подтвердить'
			const CANCEL_TEXT = '❌ Отмена'
			const confirmKeyboard = new Keyboard()
				.text(CONFIRM_TEXT)
				.text(CANCEL_TEXT)
				.resized()
				.oneTime()
			await ctx.reply(`👆 Результат. Подтвердить отправку в канал?`, {
				reply_markup: confirmKeyboard,
			})

			const { message: confirmMessage } = await conversation.waitForHears(
				[CONFIRM_TEXT, CANCEL_TEXT],
				{
					otherwise: async (ctx) =>
						await ctx.reply('👇 Нажмите кнопку снизу для подтверждения'),
				},
			)
			if (confirmMessage?.text === CANCEL_TEXT) {
				await ctx.reply('❌ Отправка отменена')
				return
			}

			await msgCtx.copyMessage(channelId, {
				reply_markup: keyboard,
			})
			await ctx.reply('✅ Сообщение отправлено в канал')
		} catch (err) {
			await ctx.reply('⚠ Ошибка при отправке сообщения')
		}
	} else {
		await ctx.reply('⚠ Вы не являетесь администратором данного канала')
	}
}
