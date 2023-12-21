const { Client, Events, GatewayIntentBits } = require("discord.js");
const blessed = require("blessed");
const contrib = require("blessed-contrib");
const { token, default_channel } = require("./config.json");

let userchannel = default_channel;
let currentGuildId;
let guildList;
let guildListNr = 0;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const screen = blessed.screen({ smartCSR: true });
const messagesBox = blessed.log({
  fg: "white",
  selectedFg: "white",
  label: " Discord Messages ",
  width: "80%",
  height: "90%",
  top: 0,
  left: 0,
  keys: true,
  vi: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: {
    ch: " ",
    track: {
      bg: "cyan",
    },
    style: {
      inverse: true,
    },
  },
  border: { type: "line" },
  style: { fg: "white", border: { fg: "cyan" } },
});

const inputBox = blessed.textarea({
  bottom: 0,
  height: "10%",
  inputOnFocus: true,
  border: { type: "line" },
  style: {
    fg: "white",
    bg: "black",
  },
  label:" Input Box "
});

const sidebarBox = blessed.box({
  width: "20%",
  height: "90%",
  label:" Servers and Channels: ",
  right: 0,
  top: 0,
  border: { type: "line" },
  keys: true,
  vi: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: {
    ch: " ",
    track: {
      bg: "cyan",
    },
    style: {
      inverse: true,
    },
  },
  style: { fg: "white", border: { fg: "cyan" } },
});

screen.append(messagesBox);
screen.append(inputBox);
screen.append(sidebarBox);

function updateSidebar() {
  const guilds = Array.from(client.guilds.cache.values());
  sidebarBox.setContent("");

  guilds.forEach((guild) => {
    if (guild.id !== currentGuildId) {
      return;
    }
    sidebarBox.pushLine(`- ${guild.name}`);
    guild.channels.cache
      .filter((chan) => !chan.parent)
      .filter((cha) => cha.type === 0)
      .forEach((channel) => {
        const indicator = channel.id === userchannel ? " <--" : "";
        sidebarBox.pushLine(
          `     - ${channel.name}(${channel.id})${indicator}`
        );
      });
    guild.channels.cache
      .filter((cat) => cat.type === 4)
      .forEach((category) => {
        sidebarBox.pushLine(`  - ${category.name}`);
        guild.channels.cache
          .filter((chan) => chan.parentId === category.id)
          .forEach((channel) => {
            const indicator = channel.id === userchannel ? " <--" : "";
            sidebarBox.pushLine(
              `     - ${channel.name}(${channel.id})${indicator}`
            );
          });
      });
  });

  screen.render();
}

screen.key(["up", "down"], function (ch, key) {
  if (key.name === "up") {
    sidebarBox.scroll(-1);
  } else if (key.name === "down") {
    sidebarBox.scroll(1);
  }
  screen.render();
});

inputBox.key(["up", "down"], function (ch, key) {
  if (key.name === "up") {
    messagesBox.scroll(-1);
  } else if (key.name === "down") {
    messagesBox.scroll(1);
  }
  screen.render();
});

inputBox.key(["right"], (ch, key) => {
  const guildCount = guildList.length - 1;
  if (guildListNr !== guildCount) {
    guildListNr = guildListNr + 1;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  } else {
    guildListNr = 0;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  }
});

inputBox.key(["left"], (ch, key) => {
  const guildCount = guildList.length - 1;
  if (guildListNr !== 0) {
    guildListNr = guildListNr - 1;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  } else {
    guildListNr = guildCount;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  }
});

screen.key(["right"], (ch, key) => {
  const guildCount = guildList.length - 1;
  if (guildListNr !== guildCount) {
    guildListNr = guildListNr + 1;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  } else {
    guildListNr = 0;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  }
});

screen.key(["left"], (ch, key) => {
  const guildCount = guildList.length - 1;
  if (guildListNr !== 0) {
    guildListNr = guildListNr - 1;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  } else {
    guildListNr = guildCount;
    currentGuildId = guildList[guildListNr].id;
    updateSidebar();
  }
});

inputBox.key(["enter"], (ch, key) => {
  const inputValue = inputBox.getValue().trim();
  if (inputValue.startsWith(":")) {
    const [command, ...args] = inputValue.slice(1).trim().split(/\s+/);

    switch (command) {
      case "q":
        process.exit(0);
        break;
      case "h":
        messagesBox.log("=== Help Menu ===");
        messagesBox.log(":h  - Show this help menu");
        messagesBox.log(":q  - Exit the application");
        messagesBox.log(":c  - Change channel");
        messagesBox.log("esc - Enable servers scrool");
        messagesBox.log("i   - Back to input mode from esc mode")
        messagesBox.log("=================");
        break;
      case "c":
        if (client.channels.cache.has(args[0])) {
          userchannel = args[0];
          messagesBox.log(`:c - Changed channel to: ${args[0]}`);
        } else {
          messagesBox.log(":c - Wrong channel id");
        }
        break;
      default:
        messagesBox.log(`Unknown command: ${command}`);
    }
  } else if (inputValue !== "") {
    const channel = client.channels.cache.get(userchannel);
    channel.send(inputValue);
  }

  inputBox.clearValue();
  screen.render();
});

inputBox.focus();
screen.render();

client.on("messageCreate", (message) => {
  if (message.channelId == userchannel) {
    const { author, content } = message;
    messagesBox.log(`${author.tag}: ${content}`);
    screen.render();
  }
});

client.once(Events.ClientReady, (readyClient) => {
  currentGuildId = client.channels.cache.get(userchannel).guildId;
  guildList = Array.from(client.guilds.cache.values());
  inputBox.readInput();
  updateSidebar();
});

client.login(token);
