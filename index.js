// Dependencies
const Discord = require('discord.js')
const token = require('./token')

// Actions
const {
  enterQueue,
  leaveQueue,
  getQueueStatus,
  getVoteStatus,
} = require('./actions')

// Discord Bot
const bot = new Discord.Client()

let queue = []
let lobbyId = 0
let votes = {
  r: 0,
  c: 0,
  b: 0,
}

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

bot.on('message', eventObj => {
  // console.log('message received', Object.keys(eventObj))
  // console.log('message received', eventObj.content)
  const msg = eventObj.content.toLowerCase()
  const isCommand = msg.startsWith('!')
  const queueData = { queue, lobbyId, votes }

  if (!isCommand) return

  switch (msg.split(' ')[0]) {
    case '!q':
      enterQueue(eventObj, queueData)
      break
    case '!leave':
      leaveQueue(eventObj, queueData)
      break
    case '!status':
      getQueueStatus(eventObj, queueData)
      break
    case '!votestatus':
      getVoteStatus(eventObj, queueData)
      break
    case '!r':
    case '!c':
    case '!b':
      submitVote(eventObj, queueData)
      break
    default:
      return
  }
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
