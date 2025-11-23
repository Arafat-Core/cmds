const axios = require("axios");
const fs = require("fs");
const ytSearch = require("yt-search");

const apiBase = "https://you-tube-video-api-by-arafat.vercel.app/yt";

async function downloadFile(url, fileName) {
  const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(fileName, Buffer.from(response));
  return fs.createReadStream(fileName);
}

async function getThumbnailStream(url) {
  const response = await axios.get(url, { responseType: "stream" });
  return response.data;
}

module.exports = {
  config: {
    name: "sing",
    version: "1.8.0",
    aliases: [],
    author: "Arafat",
    countDown: 5,
    role: 0,
    description: { en: "Search and download audio from YouTube" },
    category: "media",
    guide: {
      en: "{pn} sing [song name]\nExample: {pn} sing Despacito"
    }
  },

  onStart: async ({ api, args, event, commandName }) => {
    const keyword = args.join(" ");
    if (!keyword)
      return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐬𝐨𝐧𝐠 𝐧𝐚𝐦𝐞.", event.threadID, event.messageID);

    try {
      const searchResults = (await ytSearch(keyword)).videos.slice(0, 6);
      if (!searchResults || searchResults.length === 0)
        return api.sendMessage("𝐍𝐨 𝐫𝐞𝐬𝐮𝐥𝐭𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫: " + keyword, event.threadID, event.messageID);

      let msg = "𝐒𝐞𝐚𝐫𝐜𝐡 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:\n\n";
      for (let i = 0; i < searchResults.length; i++) {
        const video = searchResults[i];
        msg += `*${i + 1}.* ${video.title}\n𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${video.timestamp}\n𝐂𝐡𝐚𝐧𝐧𝐞𝐥: ${video.author.name}\n\n`;
      }

      const thumbnails = await Promise.all(searchResults.map(v => getThumbnailStream(v.thumbnail)));

      api.sendMessage(
        {
          body: msg + "𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 (1-6) 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐡𝐞 𝐚𝐮𝐝𝐢𝐨.",
          attachment: thumbnails
        },
        event.threadID,
        (err, infoMsg) => {
          global.GoatBot.onReply.set(infoMsg.messageID, {
            commandName,
            messageID: infoMsg.messageID,
            author: event.senderID,
            results: searchResults
          });
        },
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐚𝐫𝐜𝐡 𝐘𝐨𝐮𝐓𝐮𝐛𝐞.", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply }) => {
    try {
      const { results } = Reply;
      const choice = parseInt(event.body);

      if (isNaN(choice) || choice < 1 || choice > results.length)
        return api.sendMessage("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐡𝐨𝐢𝐜𝐞. 𝐄𝐧𝐭𝐞𝐫 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 1-6.", event.threadID, event.messageID);

      const video = results[choice - 1];
      const videoURL = video.url;

      const { data } = await axios.get(
        `${apiBase}?url=${encodeURIComponent(videoURL)}&type=mp3`
      );

      if (!data.status || !data.download_url)
        return api.sendMessage("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐮𝐝𝐢𝐨.", event.threadID, event.messageID);

      const fileName = "audio.mp3";
      await downloadFile(data.download_url, fileName);

      await api.unsendMessage(Reply.messageID);

      api.sendMessage(
        {
          body: `𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝: ${video.title}`,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => fs.unlinkSync(fileName),
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐮𝐝𝐢𝐨.", event.threadID, event.messageID);
    }
  }
};
