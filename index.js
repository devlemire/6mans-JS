// Dependencies
require('dotenv').config({ path: `${__dirname}/.env` })
const Discord = require('discord.js')

// Queue Managment
const { removeOfflinePlayerFromQueue } = require('./utils/managePlayerQueues')

// On Listeners
const { voiceStateUpdateHandler, messageHandler } = require('./onHandlers')

// Discord Bot
const bot = new Discord.Client()

// Environment Variables
const { token } = process.env

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

// Handle 6man commands when a user sends the message
bot.on('message', messageHandler)

// Remove players from the queue if they go offline
bot.on('presenceUpdate', (oldMember, newMember) => {
  if (newMember.presence.status === 'offline') {
    // Remove this player from the queue if they are in one
    removeOfflinePlayerFromQueue({ playerId: newMember.user.id, playerChannels: newMember.client.channels })
  }
})

// Delete team voice channels and queues
bot.on('voiceStateUpdate', voiceStateUpdateHandler)

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

try {
  bot.login(token)
} catch (err) {
  console.error('The bot failed to login:', err)
}

module.exports = bot
