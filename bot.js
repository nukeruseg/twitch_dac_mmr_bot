const tmi = require("tmi.js");
const fetch = require("cross-fetch");

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", async (channel, tags, message, self) => {
  if (self) {
    return;
  }
  const command = message.split(" ");
  const commandName = command[0];
  if (commandName !== "!rank") {
    await client.say(channel, "Unknown command");
    return;
  }
  const playerId = command[1];
  const randomInt = getRandomInt(0, 10000);
  const url = `http://autochess.ppbizon.com/courier/get/@${playerId}?hehe=${randomInt}`;
  const response = await fetch(url);
  const json = await response.json();
  const mmr_level = json["user_info"][playerId]["mmr_level"];
  await client.say(channel, mmr_level);
});

client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
