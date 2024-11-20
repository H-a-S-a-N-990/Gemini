require('dotenv').config();

const { Client, GatewayIntentBits, MessageAttachment } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const model = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!ask')) {
        const prompt = message.content.slice(5).trim();
        const response = await model.generateText(prompt);
        message.channel.send(response.text);
    } else if (message.content === '!sendFile') {
        
    } else if (message.content.startsWith('!hello')) {
        
    } else if (message.content.startsWith('!repeat')) {
        
    }
});

client.login(process.env.DISCORD_TOKEN);
