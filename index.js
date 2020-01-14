// Dependencies
const Discord = require('discord.js')
const token = require('./token')

// Actions
const { enterQueue, leaveQueue, getQueueStatus, getVoteStatus, submitVote } = require('./actions')

// Queue Managment
const { determinePlayerQueue } = require('./utils/managePlayerQueues')

// Discord Bot
const bot = new Discord.Client()

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

bot.on('message', eventObj => {
  const msg = eventObj.content.trim().toLowerCase()
  const isCommand = msg.startsWith('!')

  // If this is not a command, we don't give a f**k about what happens
  // See ya l8r virgin
  if (!isCommand) return

  const channel = eventObj.author.lastMessage.channel
  const command = msg.split(' ')[0]
  const playerId = eventObj.author.id
  const queue = determinePlayerQueue(playerId, command, channel)
  const validCommands = {
    '!q': true,
    '!leave': true,
    '!status': true,
    '!votestatus': true,
    '!r': true,
    '!c': true,
  }

  if (isCommand && !queue && validCommands[command]) {
    channel.send('There are currently no active queues. Type !q to create the first one!')
    return
  }

  switch (command) {
    case '!q':
      enterQueue(eventObj, queue)
      break
    case '!leave':
      leaveQueue(eventObj, queue)
      break
    case '!status':
      getQueueStatus(eventObj, queue)
      break
    case '!votestatus':
      getVoteStatus(eventObj, queue)
      break
    case '!r':
    case '!c':
      submitVote(eventObj, queue)
      break
    default:
      return
  }

  // console.log('Found queue:', queue)
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
