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
const { determinePlayerQueue, removeOfflinePlayerFromQueue, deletePlayerQueue } = require('./utils/managePlayerQueues')

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

bot.on('message', async eventObj => {
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
  const queue = determinePlayerQueue(playerId, command)

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
      await createVoiceChannels(eventObj, queue)
      break
    default:
      return
  }

  console.log('Found queue:', queue)
})

// Remove players from the queue if they go offline
bot.on('presenceUpdate', (oldMember, newMember) => {
  if (newMember.presence.status === 'offline') {
    // Remove this player from the queue if they are in one
    removeOfflinePlayerFromQueue({ playerId: newMember.user.id, playerChannels: newMember.client.channels })
  }
})

// Delete queues when the voice com channels go empty
bot.on('voiceStateUpdate', async (oldMember, newMember) => {
  const queue = determinePlayerQueue(newMember.user.id, undefined)
  const guild = newMember.guild

  // Player is not in a queue
  if (!queue) return

  // Player is in a queue
  const {
    teams: { blue, orange },
    lobby,
  } = queue

  // Track how many users joined the voice channels
  if (newMember.voiceChannelID === blue.voiceChannelID) {
    blue.voiceChannelHistory[newMember.user.id] = true
  }

  if (newMember.voiceChannelID === orange.voiceChannelID) {
    orange.voiceChannelHistory[newMember.user.id] = true
  }

  // Automatically delete the channels after all players have left their voice channels
  if (
    (oldMember.voiceChannelID === blue.voiceChannelID || oldMember.voiceChannelID === orange.voiceChannelID) &&
    (newMember.voiceChannelID !== blue.voiceChannelID || newMember.voiceChannelID !== orange.voiceChannelID)
  ) {
    if (Object.keys(blue.voiceChannelHistory).length >= 1 && Object.keys(orange.voiceChannelHistory).length >= 1) {
      const blueVoiceChannel = guild.channels.find(channelObj => channelObj.id === blue.voiceChannelID)
      const orangeVoiceChannel = guild.channels.find(channelObj => channelObj.id === orange.voiceChannelID)

      if (blueVoiceChannel.members.size === 0 && orangeVoiceChannel.members.size === 0) {
        // Delete the voice com channels
        await blueVoiceChannel.delete()
        await orangeVoiceChannel.delete()

        // Delete the player queue
        deletePlayerQueue(lobby.id)
      }
    }
  }
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
