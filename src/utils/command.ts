import {
  Command,
  CommandCategory,
  CommandCategoryExtra,
  CommandExec,
  CommandMeta,
} from "../types";

export function command(
  meta: CommandMeta,
  exec: CommandExec,
  exclusive: boolean = false
): Command {
  return {
    meta,
    exec,
    exclusive,
  };
}

export function category(
  name: string,
  commands: Command[],
  extra: CommandCategoryExtra = {}
): CommandCategory {
  return {
    name,
    commands,
    ...extra,
  };
}
