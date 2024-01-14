const axios = require("axios"); const fs = require("fs"); module.exports.config = { name: "Combined", version: "1.0.0", hasPermission: 0, usePrefix: false, credits: " rickciel", description: "Combined AI Commands", commandCategory: "ai", usages: "[ask]", cooldowns: 2, }; module.exports.run = async function ({ api, event, args }) { let { messageID, threadID, senderID, body } = event; let tid = threadID, mid = messageID; const content = encodeURIComponent(args.join(" ")); if (!content) return; try { if (args[0] === "ais") { const res = await axios.get(`https://api.kenliejugarap.com/gptgo/?text=${content}`); const respond = res.data.response; if (res.data.error) { api.sendMessage(`Error: ${res.data.error}`, tid, mid); } else { api.sendMessage(respond, tid, mid); } } else if (args[0] === "bard") { const { threadID, messageID, type, messageReply, body } = event; let question = ""; if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") { const attachment = messageReply.attachments[0]; const imageURL = attachment.url; question = await convertImageToText(imageURL); if (!question) { api.sendMessage( "❌ Failed to convert the photo to text. Please try again with a clearer photo.", threadID, messageID ); return; } } else { question = body.trim();
 if (!question) { api.sendMessage("Please provide a question or query", threadID, messageID); return; } } const res = await axios.get( `https://sensui-useless-apis.codersensui.repl.co/api/tools/bard?question=${encodeURIComponent( question )}` ); const respond = res.data.message; const imageUrls = res.data.imageUrls; if (Array.isArray(imageUrls) && imageUrls.length > 0) { const attachments = []; if (!fs.existsSync("cache")) { fs.mkdirSync("cache"); } for (let i = 0; i < imageUrls.length; i++) { const url = imageUrls[i]; const imagePath = `cache/image${i + 1}.png`; try { const imageResponse = await axios.get(url, { responseType: "arraybuffer" }); fs.writeFileSync(imagePath, imageResponse.data); attachments.push(fs.createReadStream(imagePath)); } catch (error) { console.error("Error occurred while downloading and saving the image:", error); } } api.sendMessage( { attachment: attachments, body: respond, }, threadID, messageID ); } else { api.sendMessage(respond, threadID, messageID); } } else if (args[0] === "virtual") { const userMessage = args.slice(1).join(" "); const apiUrl = 'https://blackbox.chatbotmesss.repl.co/ask'; const response = await axios.get(apiUrl, { params: { q: userMessage } }); const data = response.data; if (data.message !== "") { api.sendMessage(data.message, tid, mid); } else { api.sendMessage("Sorry, unable to get a response from the AI.", tid, mid); } } } catch (error) { console.error(error); api.sendMessage("An error occurred while fetching the data.", tid, mid); } }; async function convertImageToText(imageURL) { const response = await axios.get( `https://api.heckerman06.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}` ); return response.data.extractedText; }