// Dependencies
require('dotenv').config({ path: `${__dirname}/.env` })
const Discord = require('discord.js')

// Actions
const {
  enterQueue,
  leaveQueue,
  getQueueStatus,
  getVoteStatus,
  submitVote,
  sendCommandList,
  createVoiceChannels,
} = require('./actions')

// Queue Managment
const { determinePlayerQueue, removeOfflinePlayerFromQueue } = require('./utils/managePlayerQueues')

// Commands
const { commandToString, validCommandCheck } = require('./utils/commands')

// Discord Bot
const bot = new Discord.Client()

// Environment Variables
const { token, NODE_ENV, channelName } = process.env

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

bot.on('message', eventObj => {
  const msg = eventObj.content.trim().toLowerCase()
  const type = eventObj.channel.type
  const isCommand = msg.startsWith('!')

  // If this is not a command,
  // If this is a DM to the bot,
  // If there is a channelName provided in the .env and the channel name doesn't match,
  // If the user is in invisible mode or offline,
  // See ya l8r virgin
  if (eventObj.author.presence.status === 'offline') return
  if (channelName && eventObj.channel.name !== channelName) return
  if (!isCommand) return
  if (NODE_ENV !== 'development' && type === 'dm') return

  const channel = eventObj.author.lastMessage.channel
  const command = msg.split(' ')[0]
  const playerId = eventObj.author.id
  const queue = determinePlayerQueue(playerId, command, channel)

  if (isCommand && !queue && validCommandCheck[command]) {
    channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
    return
  }

  switch (command) {
    case commandToString.queue:
      enterQueue(eventObj, queue)
      break
    case commandToString.leave:
      leaveQueue(eventObj, queue)
      break
    case commandToString.status:
      getQueueStatus(eventObj, queue)
      break
    case commandToString.votestatus:
      getVoteStatus(eventObj, queue)
      break
    case commandToString.r:
    case commandToString.c:
      submitVote(eventObj, queue)
      break
    case commandToString.help:
      sendCommandList(eventObj)
      break
    case '!6m-cvc':
      createVoiceChannels(eventObj, queue)
      break
    default:
      return
  }

  // console.log('Found queue:', queue)
})

bot.on('presenceUpdate', (oldMember, newMember) => {
  if (newMember.presence.status === 'offline') {
    // Remove this player from the Q if they are in one
    removeOfflinePlayerFromQueue({ playerId: newMember.user.id, playerChannels: newMember.client.channels })
  }
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
