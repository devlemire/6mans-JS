// Dependencies
const Discord = require('discord.js')
const token = require('./token')

// Actions
const { enterQueue, leaveQueue, getQueueStatus } = require('./actions')

// Discord Bot
const bot = new Discord.Client()

let queue = []

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

bot.on('message', eventObj => {
  // console.log('message received', Object.keys(eventObj))
  // console.log('message received', eventObj.content)
  const msg = eventObj.content.toLowerCase()
  const isCommand = msg.startsWith('!')

  if (!isCommand) return

  switch (msg.split(' ')[0]) {
    case '!q':
      enterQueue(eventObj, queue)
      break
    case '!leave':
      leaveQueue(eventObj, queue)
      break
    case '!status':
      getQueueStatus(eventObj, queue)
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
