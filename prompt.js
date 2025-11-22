const axios = require("axios");

module.exports = {
  config: {
    name: "prompt",
    aliases: ["p"],
    version: "1.0",
    author: "Arafat",
    countDown: 5,
    role: 0,
    shortDescription: "Image to prompt",
    longDescription: "Reply to any image and get a prompt",
    category: "tools"
  },

  onStart: async function ({ api, event }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("error", event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];

      if (attachment.type !== "photo") {
        return api.sendMessage("reply a photo....!!", event.threadID, event.messageID);
      }

      const imageUrl = attachment.url;

      const response = await axios.post(
        "https://prompt-api-arafat.vercel.app/api/predict",
        { imageUrl }
      );

      if (response.data && response.data.prompt) {
        return api.sendMessage("📝 Prompt:\n" + response.data.prompt, event.threadID, event.messageID);
      } else {
        return api.sendMessage("promote error.....!!", event.threadID, event.messageID);
      }

    } catch (err) {
      console.log(err);
      return api.sendMessage("Error: " + err.message, event.threadID, event.messageID);
    }
  }
};
