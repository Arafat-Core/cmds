const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "catbox",
    version: "1.0.1",
    author: "𝐀𝐫𝐚𝐟𝐚𝐭",
    countDown: 5,
    role: 0,
    shortDescription: "Upload file to Catbox (no key)",
    longDescription: "Upload any file to Catbox and get direct link (no API key needed)",
    category: "tools"
  },

  onStart: async function ({ api, event }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("𝐑𝐞𝐩𝐥𝐲 𝐓𝐡𝐞 𝐅𝐢𝐥𝐞", event.threadID, event.messageID);
      }

      const file = event.messageReply.attachments[0];
      const url = file.url;

      const filePath = path.join(__dirname, `${Date.now()}_${file.filename || "upload"}`);

      
      const fileData = await axios.get(url, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, fileData.data);

     
      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(filePath));

      
      const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders()
      });

      const link = uploadResponse.data;

     
      fs.unlinkSync(filePath);

      api.sendMessage(`${link}`, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("Catbox upload failed!", event.threadID, event.messageID);
    }
  }
};
