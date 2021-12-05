const tmi = require('tmi.js');
import fetch from 'node-fetch';

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}

// Called every time a message comes in
async function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log(msg);
  // Remove whitespace from chat message
  const command = msg.split(' ');
  const commandName = command[0];
  if (commandName !== '!rank') {
    await client.say('Unknown command');
    return;
  }
  const playerId = command[1];
  const randomInt = getRandomInt(0, 10000);
  const url = `http://autochess.ppbizon.com/courier/get/@${playerId}?hehe=${randomInt}`;
  const response = await fetch(url);
  const json = await response.json();
  client.say(json);
  const mmr_level = json['mmr_level'];
  client.say(mmr_level);
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
