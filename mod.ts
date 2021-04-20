import { Bot } from './client.ts'
import { Intents } from './deps.ts'
import { DISCORD_TOKEN } from './TOKEN.ts'

const bot = new Bot()

bot.connect(DISCORD_TOKEN, Intents.None)
