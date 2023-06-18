# Proyect notes / instructions.
> `command` type.
```js
export interface Command {
  meta: CommandMeta
  exec: CommandExec
  type?: number
}
```
## parameters:

|Param|Expected Type|Description|
|---|---|---|
|meta|`object`|Command data, like name, description, options, type, etc. `APISlashCommand`|
|exec|[`async`]`function`|Actions or functions to execute, this receives one type object parameter with three properties: `client`(obj), `interaction`(obj) and `log`(fn).|
|type|`number`|Command type, for more information, read the code block below |


```
0 | void(0) = public
1 = test
2 = private
```

### Panel builder.

```js
new Panel(interaction)
      .returnAfterAction(true)
      .addAction({
        id: "action:yes",
        type: 0,
        todo: (int, next) => {
          console.log("OK");
          next();
        },
        next: "on_yes_screen",
      })
      .addAction({
        id: "action:no",
        type: 0,
        next: "on_no_screen",
      })
      .addScreen({
        id: "main",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Tap yes!")
            .setDescription("I know you want it ;)")
            .setColor(embedColor),
        ],
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setCustomId("yes")
              .setLabel("Yes!")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("no")
              .setLabel("NO!")
              .setStyle(ButtonStyle.Danger),
          ]),
        ],
      })
      .addScreen({
        id: "on_yes_screen",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Yupiii, this is working!")
            .setDescription("Yes! this is totally working!")
            .setColor(embedColor),
        ],
        components: [],
      })
      .addScreen({
        id: "on_no_screen",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Ouh, ok.")
            .setDescription("This isn't working, :(")
            .setColor(embedColor),
        ],
        components: [],
      })
      .init();
      ```