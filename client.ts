import { OpenAICommand } from './commands/openai.ts'
import { CommandClient } from './deps.ts'

export class Bot extends CommandClient {
  constructor() {
    super({
      prefix: '!'
    })
    this.commands.add(OpenAICommand)
  }
}
