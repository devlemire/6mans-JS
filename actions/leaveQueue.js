const { deletePlayerQueue } = require('../utils/managePlayerQueues')
const { commandToString } = require('../utils/commands')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { players, lobby, playerIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const playerIndexInQueue = players.findIndex(playerObj => playerObj.id === playerId)

  if (playerNotInQueue(playerId, queue)) {
    // Player is not in the queue
    return channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  }

  // Player is in the queue
  players.splice(playerIndexInQueue, 1)
  delete playerIdsIndexed[playerId]

  channel.send(`You have left the queue <@${playerId}>`)

  if (players.length === 0) {
    deletePlayerQueue(lobby.id)
  }
}
