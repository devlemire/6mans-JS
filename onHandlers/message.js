// Actions
const {
  enterQueue,
  leaveQueue,
  getQueueStatus,
  getVoteStatus,
  submitVote,
  sendCommandList,
  kickPlayer,
} = require('../actions')

// Queue Managment
const { determinePlayerQueue } = require('../utils/managePlayerQueues')

// Commands
const { commandToString, validCommandCheck } = require('../utils/commands')

// Environment Variables
const { NODE_ENV, channelName, debugLogs } = process.env

module.exports = async (eventObj, botUser = { id: undefined }) => {
  const msg = eventObj.content.trim().toLowerCase()
  const type = eventObj.channel.type
  const isCommand = msg.startsWith('!')
  const authorId = eventObj.author.id
  const commonLogCheck = debugLogs === 'true' && authorId !== botUser.id

  // If this is not a command,
  // If this is a DM to the bot,
  // If there is a channelName provided in the .env and the channel name doesn't match,
  // If the user is in invisible mode or offline,
  // See ya l8r virgin
  // if (eventObj.author.presence.status === 'offline') {
  //   if (commonLogCheck) {
  //     console.log('The user is offline, disregarding message')
  //   }

  //   return
  // }

  if (channelName && eventObj.channel.name !== channelName) {
    if (commonLogCheck) {
      console.log('The user is typing on a different channel, disregarding message')
      console.log(eventObj.channel.name + ' !== ' + channelName)
    }

    return
  }

  if (!isCommand) {
    if (commonLogCheck) {
      console.log('The user is not typing a 6mans command, disregarding message')
    }

    return
  }

  if (NODE_ENV !== 'development' && type === 'dm') {
    if (commonLogCheck) {
      console.log('The user is direct messaging the bot, disregarding message')
    }

    return
  }

  // Dont execute any logic on bot messages
  if (authorId === botUser.id) return

  const channel = eventObj.channel
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
    case commandToString.kick:
      kickPlayer(eventObj, queue)
      break
    default:
      return
  }

  if (queue) {
    console.log('Found queue:', queue)
  }
}
