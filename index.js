// Dependencies
const Discord = require('discord.js')
const token = require('./token')
const randomstring = require('randomstring')

// Actions
const { enterQueue, leaveQueue, getQueueStatus, getVoteStatus, submitVote } = require('./actions')

// Discord Bot
const bot = new Discord.Client()

let lobbyId = 0
let lobbyPassword = randomstring.generate({ length: 3 }).toLowerCase()

let queue = {
  players: [],
  votes: {
    r: 0,
    c: 0,
    playersWhoVoted: [],
  },
  teamCreationInProgress: false,
  teams: {
    blue: [],
    orange: [],
  },
  lobby: {
    id: lobbyId,
    name: `smjs${lobbyId}`,
    password: lobbyPassword,
  },
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
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
