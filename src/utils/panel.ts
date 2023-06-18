import {
  ChatInputCommandInteraction,
  MessageComponentInteraction,
} from "discord.js";
import { EventEmitter } from "node:events";
import { EmbedBuilder, Message } from "discord.js";

/**
 *  Action types:
 *    0: exec. action -> edit reply.
 *    1: exec. action -> another action
 *
 */

type Action = {
  id: string;
  type: number;
  next?: string;
  todo?: (int: MessageComponentInteraction, callback: () => void) => void;
};
type Author = {
  name: string;
  url?: string;
  iconURL?: string;
};
type Screen = {
  id: string;
  type?: number;
  embeds: EmbedBuilder[];
  components?: any[];
};

class Panel extends EventEmitter {
  actions: Action[];
  screens: Screen[];
  interaction: ChatInputCommandInteraction;
  return_after_action: boolean;

  constructor(interaction: ChatInputCommandInteraction) {
    super();

    this.return_after_action = false;
    this.interaction = interaction;
    this.actions = [];
    this.screens = [];
  }

  getFirstScreen() {
    return (
      this.screens[0] ?? {
        id: "error",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("This is an error message.")
            .setDescription("Please, report this on the support server."),
        ],
        components: [],
      }
    );
  }

  returnAfterAction(r: boolean = true) {
    this.return_after_action = r;
    return this;
  }
  setScreens(ArrayOfScreens: Screen[]) {
    this.screens = ArrayOfScreens;
    return this;
  }
  setActions(ArrayOfActions: Action[]) {
    this.actions = ArrayOfActions;
    return this;
  }
  addScreen(ScreenData: Screen) {
    this.screens.push(ScreenData);
    return this;
  }
  addAction(ActionData: Action) {
    this.actions.push(ActionData);
    return this;
  }
  init() {
    let { embeds, components } = this.screens[0];

    this.interaction
      .reply({
        embeds,
        components,
      })
      .then((reply) => {
        let c = reply.createMessageComponentCollector({
          filter: (f) => f?.user?.id === this.interaction?.user?.id,
          time: 180e3,
        });

        c.on("collect", async (int) => {
          c?.resetTimer();

          let action: Action | undefined = this.actions.find(
            (x) => x.id === `action:${int.customId}`
          );
          if (action) {
            if (typeof action?.todo === "function") {
              action?.todo(int, () => {
                if (typeof action?.next === "string") {
                  let next: Screen | undefined = this.screens.find(
                    (x) => x.id === action?.next
                  );
                  if (next) {
                    int.deferUpdate().then(() => {
                      int?.editReply({
                        embeds: next?.embeds,
                        components: next?.components || [],
                      });
                    });
                  } else {
                    let main = this.getFirstScreen() as Screen;
                    if (main) {
                      int.deferUpdate().then(() => {
                        int?.editReply({
                          embeds: main?.embeds,
                          components: main?.components || [],
                        });
                      });
                    }
                  }
                } else {
                  let main = this.getFirstScreen() as Screen;
                  if (main) {
                    int.deferUpdate().then(() => {
                      int?.editReply({
                        embeds: main?.embeds,
                        components: main?.components || [],
                      });
                    });
                  }
                }
              });
            } else {
              if (typeof action?.next === "string") {
                let next: Screen | undefined = this.screens.find(
                  (x) => x.id === action?.next
                );
                if (next) {
                  int.deferUpdate().then(() => {
                    int?.editReply({
                      embeds: next?.embeds,
                      components: next?.components || [],
                    });
                  });
                } else {
                  let main = this.getFirstScreen() as Screen;
                  if (main) {
                    int.deferUpdate().then(() => {
                      int?.editReply({
                        embeds: main?.embeds,
                        components: main?.components || [],
                      });
                    });
                  }
                }
              } else {
                let main = this.getFirstScreen() as Screen;
                if (main) {
                  int.deferUpdate().then(() => {
                    int?.editReply({
                      embeds: main?.embeds,
                      components: main?.components || [],
                    });
                  });
                }
              }
            }
          }
        });
      });
  }
}

export { Action, Author, EmbedBuilder as Embed, Screen, Panel };
