// Dependencies
require('dotenv').config({ path: `${__dirname}/.env` })
const Discord = require('discord.js')

// Queue Managment
const { removeOfflinePlayerFromQueue } = require('./utils/managePlayerQueues')

// On Listeners
const { voiceStateUpdateHandler, messageHandler } = require('./onHandlers')

// Discord Bot
const bot = new Discord.Client()
// Bot User Info
let botUser = {}

// Environment Variables
const { token, channelName } = process.env

bot.on('ready', (e) => {
  const { username, id } = bot.user

  botUser.username = username
  botUser.id = id

  console.log(`Logged in as: ${username} - ${id}`)
  console.log(`I will be listening for messages on your text-channel: ${channelName}`)

  console.log('****** (safe) process.env variables ******')
  console.log('channelName:', process.env.channelName)
  console.log('categoryName:', process.env.categoryName)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('lobbySeries', process.env.lobbySeries)
  console.log('lobbyRegion', process.env.lobbyRegion)
  console.log('lobbyName', process.env.lobbyName)
  console.log('****** process.env variables ******')
})

// Handle 6man commands when a user sends the message
bot.on('message', (eventObj) => messageHandler(eventObj, botUser))

// Remove players from the queue if they go offline
// bot.on('presenceUpdate', (oldMember, newMember) => {
//   if (newMember.presence.status === 'offline') {
//     // Remove this player from the queue if they are in one
//     removeOfflinePlayerFromQueue({ playerId: newMember.user.id, playerChannels: newMember.client.channels })
//   }
// })

// Delete team voice channels and queues
bot.on('voiceStateUpdate', voiceStateUpdateHandler)

bot.on('disconnect', (e) => {
  console.log('Bot disconnected:', e)
})

async function login() {
  try {
    await bot.login(token)
  } catch (err) {
    console.error('The bot failed to login:', err)
  }
}

login()
module.exports = bot
