import { config as configEnv } from 'dotenv'
import { z } from 'zod'

configEnv()

const envSchema = z.object({
	BOT_TOKEN: z.string().min(1),
	BOT_ADMINS: z
		.string()
		.transform((val) => JSON.parse(val))
		.pipe(z.array(z.number().int().positive())),
	DEBUG: z.enum(['True', 'False']).transform((val) => val === 'True'),
})

const env = envSchema.parse(process.env)

export const config = {
	BOT_TOKEN: env.BOT_TOKEN,
	BOT_ADMINS: env.BOT_ADMINS,
	DEBUG: env.DEBUG,
} as const
