const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const app = express();
const PORT = process.env.PORT || 3000;


client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!ai ")) {
    const prompt = message.content.slice(4).trim(); // Extract the prompt
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
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


app.get("/", (req, res) => {
  res.send("Discord bot with Google AI is running!");
});


app.get("/status", (req, res) => {
  const status = {
    bot: {
      username: client.user?.tag || "Not logged in",
      connected: client.isReady(),
    },
    uptime: process.uptime(),
  };
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
