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
  const hasSymbols = command[1].some(c => c.isChar(c));
  if (hasSymbols) {
    
  }
  const randomInt = getRandomInt(0, 10000);
  const url = `http://autochess.ppbizon.com/courier/get/@${playerId}?hehe=${randomInt}`;
  const response = await fetch(url);
  const json = await response.json();
  const mmr_level = json["user_info"][playerId]["mmr_level"];
  const human_mmr = convertToHuman(mmr_level);
  await client.say(channel, human_mmr);
});

client.on("connected", (addr, port) => console.log(`* Connected to ${addr}:${port}`));

// Connect to Twitch:
client.connect();

async function getPlayerId(argument) {
  const hasSymbols = argument.some(c => c.isChar(c));
  if (!hasSymbols) {
    return 
  }
  const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${nickName}`;
  const response = await fetch(url);
  const json = await response.json();
  if (json['response']['steamid']) {
    return json['response']['steamid'];
  } else {
    return null;
  }
}

function isChar(c) {
  return c.toUpperCase() != c.toLowerCase() || c.codePointAt(0) > 127;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function convertToHuman(mmr) {
  if (mmr === 0) {
    return 'Unranked';
  } else if (mmr > 0 && mmr <= 9) {
    return `Pawn ${mmr}`;    
  } else if (mmr > 9 && mmr <= 18) {
    return `Knight ${mmr - 9}`;    
  } else if (mmr > 18 && mmr <= 27) {
    return `Bishop ${mmr - 18}`;
  } else if (mmr > 27 && mmr <= 36) {
    return `Rook ${mmr - 27}`;
  }
}