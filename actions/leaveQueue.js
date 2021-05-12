const { deletePlayerQueue } = require('../utils/managePlayerQueues')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  let { players, playerIdsIndexed, lobby } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id
  const playerIndexInQueue = players.findIndex(playerObj => playerObj.id === playerId)

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  players.splice(playerIndexInQueue, 1)
  delete playerIdsIndexed[playerId]

  channel.send(`You have left the queue <@${playerId}>`)

  if (Object.keys(playerIdsIndexed).length === 0) {
    deletePlayerQueue(lobby.id)
  }
}
