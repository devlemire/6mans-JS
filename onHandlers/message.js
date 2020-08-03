// Actions
const { enterQueue, leaveQueue, getQueueStatus, getVoteStatus, submitVote, sendCommandList } = require('../actions')

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
  if (eventObj.author.presence.status === 'offline' && commonLogCheck) {
    return console.log('The user is offline, disregarding message')
  }

  if (channelName && eventObj.channel.name !== channelName && commonLogCheck) {
    return console.log('The user is typing on a different channel, disregarding message')
  }

  if (!isCommand && commonLogCheck) {
    return console.log('The user is not typing a 6mans command, disregarding message')
  }

  if (NODE_ENV !== 'development' && type === 'dm' && commonLogCheck) {
    return console.log('The user is direct messaging the bot, disregarding message')
  }
  
  // Dont execute any logic on bot messages
  if (authorId === botUser.id) return

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
    default:
      return
  }

  if (queue) {
    console.log('Found queue:', queue)
  }
}
