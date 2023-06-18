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
  type: number = 0
): Command {
  return {
    meta,
    exec,
    type,
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
