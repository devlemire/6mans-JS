const { deletePlayerQueue } = require('../utils/managePlayerQueues')
const { commandToString } = require('../utils/commands')

module.exports = (eventObj, queue) => {
  const { players, lobby, playerIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const playerInQueue = playerIdsIndexed[playerId]
  const playerIndexInQueue = players.findIndex(playerObj => playerObj.id === playerId)

  if (players.length === 0 || !playerInQueue) {
    channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  } else {
    players.splice(playerIndexInQueue, 1)
    delete playerIdsIndexed[playerId]

    channel.send(`You have left the queue <@${playerId}>`)

    if (players.length === 0) {
      deletePlayerQueue(lobby.id)
    }
  }
}
