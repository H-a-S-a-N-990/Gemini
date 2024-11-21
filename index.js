const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.on("messageCreate", async (message) => {
  // Check if the message starts with "!ai "
  if (message.content.startsWith("!ai ")) {
    const prompt = message.content.slice(4).trim(); // Extract the prompt
    try {
      // Call the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);

      // Send the result back to Discord
      if (result.response?.text) {
        message.reply(result.response.text());
      } else {
        message.reply("I couldn't generate a response.");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      message.reply("There was an error generating a response.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
