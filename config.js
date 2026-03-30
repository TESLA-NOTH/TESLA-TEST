// OH MY BABY 🍼
// DON'T COPY MY CMD AND CODES🇦🇫
// POWERED BY NOTHING TECH

const fs = require('fs');
const { getConfig } = require("./lib/configdb");
require('dotenv').config();

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "NOTH-TESLA~PEE2PA7WH0RIR39C8W9O",
  PREFIX: getConfig("PREFIX") || process.env.PREFIX || ".",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "93794320865",
  OWNER_NAME: process.env.OWNER_NAME || "ɴᴏᴛʜɪɴɢ ᴛᴇᴄʜ",
  BOT_NAME: "ᴛᴇꜱʟᴀ-ʙᴏᴛ",
  STICKER_NAME: "ᴛᴇꜱʟᴀ-ʙᴏᴛ",
  DESCRIPTION: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴏᴛʜɪɴɢ ᴛᴇᴄʜ*",
  MENU_IMAGE_URL: "https://files.catbox.moe/3fuy44.jpg'",
  ALIVE_IMG: "https://files.catbox.moe/3fuy44.jpg'",
  LIVE_MSG: "> ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ ᴛᴇꜱʟᴀ-ʙᴏᴛ⚡",
  DEV: "93794320865",
  MODE: process.env.MODE || "public",
  AUTO_STATUS_SEEN: "false",
  AUTO_STATUS_REPLY: "false",
  AUTO_STATUS_REACT: "false",
  AUTO_STATUS_MSG: "*ꜱᴇᴇɴ ʏᴏᴜʀ ꜱᴛᴀᴛᴜꜱ ʙʏ ᴛᴇꜱʟᴀ-ʙᴏᴛ 🤍*",
  AUTO_REACT: "false",
  AUTO_VOICE: "false",
  AUTO_STICKER: "false",
  AUTO_REPLY: "false",
  AUTO_TYPING: "false",
  AUTO_RECORDING: "false",
  ALWAYS_ONLINE: "false",
  READ_MESSAGE: "false",
  READ_CMD: "false",
  ANTI_CALL: getConfig("ANTI_CALL") || "false",
  ANTI_LINK: process.env.ANTI_LINK || "false",
  ANTILINK_WARN: "false",
  ANTILINK_KICK: "false",
  ANTIVIEW_ONCE: "true",
  ANTI_DELETE: process.env.ANTI_DELETE || "true",
  ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",
  ANTI_BAD:"false",
  WELCOME: process.env.WELCOME || "false",
  ADMIN_EVENTS: "false",
  MENTION_REPLY: "false",
  CUSTOM_REACT: "false",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍"
};
