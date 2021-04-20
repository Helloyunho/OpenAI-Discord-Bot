import { ValidationError } from 'https://deno.land/x/cliffy@v0.18.2/flags/_errors.ts'
import { openai } from '../const.ts'
import {
  Command,
  CommandContext,
  parseFlags,
  OptionType,
  IParseOptions
} from '../deps.ts'

export class OpenAICommand extends Command {
  name = 'openai'
  parser: IParseOptions = {
    flags: [
      {
        name: 'engine',
        aliases: ['e'],
        type: OptionType.STRING,
        required: true
      },
      {
        name: 'temperature',
        aliases: ['t', 'temp'],
        type: OptionType.NUMBER
      },
      {
        name: 'responseLength',
        aliases: ['l', 'resp-length'],
        type: OptionType.NUMBER
      },
      {
        name: 'topP',
        aliases: ['p', 'top-p'],
        type: OptionType.NUMBER
      },
      {
        name: 'frequencyPenalty',
        aliases: ['f', 'freq-penalty'],
        type: OptionType.NUMBER
      },
      {
        name: 'presencePenalty',
        aliases: ['r', 'pres-penalty'],
        type: OptionType.NUMBER
      },
      {
        name: 'bestOf',
        aliases: ['b', 'best-of'],
        type: OptionType.NUMBER
      },
      {
        name: 'stopSequence',
        aliases: ['s', 'stop-seq'],
        type: OptionType.STRING
      }
    ]
  }

  async execute(ctx: CommandContext) {
    const args = ctx.argString.split('```')
    let flags
    try {
      flags = parseFlags(args[0].split(' '), this.parser).flags
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.channel.send('Engine flag is not set.')
        return
      } else {
        throw err
      }
    }

    if (flags.responseLength !== undefined && flags.responseLength > 200) {
      ctx.channel.send('Response length is too long. Maximum limit is 200.')
      return
    }
    const content = args.slice(1, args.length - 1).join('```')
    if (content === undefined) {
      ctx.channel.send('Please set examples text.')
      return
    }

    const openaiResp = await openai.createCompletion(flags.engine, {
      temperature: flags.temperature,
      maxTokens: flags.responseLength,
      topP: flags.topP,
      frequencyPenalty: flags.frequencyPenalty,
      presencePenalty: flags.presencePenalty,
      bestOf: flags.bestOf,
      stop: flags.stopSequence,
      prompt: content
    })

    if (openaiResp.choices[0].text === '') {
      ctx.message.reply('```null```')
    } else {
      ctx.message.reply('```' + openaiResp.choices[0].text + '```')
    }
  }

  async onError() {}
}
