// Actions
const { enterQueue, leaveQueue, getQueueStatus, getVoteStatus, submitVote, sendCommandList } = require('../actions')

// Queue Managment
const { determinePlayerQueue } = require('../utils/managePlayerQueues')

// Commands
const { commandToString, validCommandCheck } = require('../utils/commands')

// Environment Variables
const { NODE_ENV, channelName } = process.env

module.exports = async eventObj => {
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
    default:
      return
  }

  // console.log('Found queue:', queue)
}
