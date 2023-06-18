import { Event } from '../types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import messageCreate from './messageCreate'
import guildMemberAdd from './guildMemberAdd'

const events: Event<any>[] = [
  ...interactionCreate,
  ...guildMemberAdd,
  ...messageCreate,
  ready,
]

export default events
