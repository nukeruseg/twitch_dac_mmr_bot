const tmi = require("tmi.js");
const fetch = require("cross-fetch");

const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
};

const client = new tmi.client(opts);

client.on("message", async (channel, tags, message, self) => {
  if (self) {
    return;
  }
  if (message.startsWith('!'))
  const command = message.split(' ');
  const [commandName, player] = command;
  if (commandName !== "!rank") {
    await client.say(channel, "Unknown command");
    return;
  }
  const playerId = await getPlayerId(player);
  if (!playerId) {
    await client.say(channel, `Can't get rank for user ${player}`);
    return;
  }
  const randomInt = getRandomInt(0, 10000);
  const url = `http://autochess.ppbizon.com/courier/get/@${playerId}?hehe=${randomInt}`;
  const response = await fetch(url);
  const json = await response.json();
  const playerInfo = json["user_info"][playerId];
  const human_mmr = convertToHuman(playerInfo);
  await client.say(channel, `@${tags.username} rank of ${player} is ${human_mmr}`);
});

client.on("connected", (addr, port) => console.log(`* Connected to ${addr}:${port}`));

client.connect();

async function getPlayerId(argument) {
  const hasSymbols = argument.split('').some(isChar);
  if (!hasSymbols) {
    return argument;
  }
  const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${argument}`;
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

function convertToHuman(playerInfo) {
  const mmr = playerInfo["mmr_level"];
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
  } else if (mmr === 37) {
    return 'King';
  } else {
    return `Queen #${playerInfo['queen_rank']}`;
  }
}