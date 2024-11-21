require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { TextServiceClient } = require('@google/generative-ai');

// Initialize Discord Client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Initialize Google Generative AI Client
const generativeAiClient = new TextServiceClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Bot Ready Event
client.once('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}!`);
});

// Message Handling
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Trigger AI response with !ai command
  if (message.content.startsWith('!ai ')) {
    const prompt = message.content.slice(4).trim();
    if (!prompt) return message.reply("Please provide a prompt for the AI!");

    try {
      const [response] = await generativeAiClient.generateText({
        prompt: { text: prompt },
      });

      const reply = response.candidates[0]?.text || "Sorry, I couldn't generate a response.";
      message.reply(reply);
    } catch (error) {
      console.error("Error with Generative AI:", error);
      message.reply("An error occurred while generating the response.");
    }
  }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
