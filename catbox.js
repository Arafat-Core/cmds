const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "catbox",
    version: "1.0.4",
    author: "𝐀𝐫𝐚𝐟𝐚𝐭",
    countDown: 5,
    role: 0,
    shortDescription: "𝐔𝐩𝐥𝐨𝐚𝐝 𝐟𝐢𝐥𝐞 𝐭𝐨 𝐂𝐚𝐭𝐛𝐨𝐱 (𝐦𝐩𝟒/𝐣𝐩𝐠)",
    longDescription: "𝐔𝐩𝐥𝐨𝐚𝐝 𝐯𝐢𝐝𝐞𝐨 (𝐦𝐩𝟒), 𝐚𝐮𝐝𝐢𝐨 (𝐦𝐩𝟒) 𝐨𝐫 𝐢𝐦𝐚𝐠𝐞 (𝐣𝐩𝐠/𝐣𝐩𝐞𝐠) 𝐭𝐨 𝐂𝐚𝐭𝐛𝐨𝐱 𝐚𝐧𝐝 𝐫𝐞𝐜𝐞𝐢𝐯𝐞 𝐚 𝐝𝐢𝐫𝐞𝐜𝐭 𝐥𝐢𝐧𝐤.",
    category: "tools"
  },

  onStart: async function ({ api, event }) {
    try {
      if (
        !event.messageReply ||
        !event.messageReply.attachments ||
        event.messageReply.attachments.length === 0
      ) {
        return api.sendMessage(
          "𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐟𝐢𝐥𝐞 (𝐦𝐩𝟒/𝐣𝐩𝐠) 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝.",
          event.threadID,
          event.messageID
        );
      }

      const file = event.messageReply.attachments[0];
      const url = file.url;

      let filename =
        file.filename ||
        path.basename(url.split("?")[0]) ||
        `upload_${Date.now()}`;

      let ext = path.extname(filename).toLowerCase().replace(".", "");

      if (!ext && file.type) {
        const t = file.type.split("/")[1];
        if (t) ext = t.toLowerCase();
      }

      const allowed = ["mp4", "jpg", "jpeg"];

      if (!ext || !allowed.includes(ext)) {
        return api.sendMessage(
          "𝐎𝐧𝐥𝐲 𝐌𝐏𝟒 (𝐯𝐢𝐝𝐞𝐨/𝐚𝐮𝐝𝐢𝐨) 𝐚𝐧𝐝 𝐉𝐏𝐆/𝐉𝐏𝐄𝐆 𝐢𝐦𝐚𝐠𝐞𝐬 𝐚𝐫𝐞 𝐬𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐝.",
          event.threadID,
          event.messageID
        );
      }

      const tmpDir = os.tmpdir();
      const safeName = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext === "jpeg" ? "jpg" : ext}`;
      const filePath = path.join(tmpDir, safeName);

      const response = await axios.get(url, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        response.data.pipe(writer);

        writer.on("error", err => {
          writer.close();
          reject(err);
        });

        writer.on("close", () => resolve());
      });

      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(filePath), {
        filename: safeName
      });

      const uploadResponse = await axios.post(
        "https://catbox.moe/user/api.php",
        form,
        {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      const link =
        typeof uploadResponse.data === "string"
          ? uploadResponse.data.trim()
          : JSON.stringify(uploadResponse.data);

      try {
        fs.unlinkSync(filePath);
      } catch (e) {}

      return api.sendMessage(
        `𝐔𝐩𝐥𝐨𝐚𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥\n𝐋𝐢𝐧𝐤: ${link}`,
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.error("Catbox upload error:", error);

      return api.sendMessage(
        "𝐔𝐩𝐥𝐨𝐚𝐝 𝐅𝐚𝐢𝐥𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐓𝐫𝐲 𝐀𝐠𝐚𝐢𝐧.",
        event.threadID,
        event.messageID
      );
    }
  }
};
