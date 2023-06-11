import { Event } from '../types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import guildMemberAdd from './guildMemberAdd'

const events: Event<any>[] = [
  ...interactionCreate,
  ...guildMemberAdd,
  ready,
]

export default events
