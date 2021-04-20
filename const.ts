import { OpenAI } from './deps.ts'
import { OPENAI_TOKEN } from './TOKEN.ts'

export const openai = new OpenAI(OPENAI_TOKEN)
