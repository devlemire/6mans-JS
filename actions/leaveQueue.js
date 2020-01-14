const { deletePlayerQueue } = require('../utils/managePlayerQueues')

module.exports = (eventObj, queue) => {
  const { players, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const playerIndexInQueue = players.findIndex(playerObj => playerObj.id === playerId)

  if (players.length === 0 || playerIndexInQueue === -1) {
    channel.send(`You have not entered the queue <@${playerId}>`)
  } else {
    players.splice(playerIndexInQueue, 1)
    channel.send(`You have left the queue <@${playerId}>`)

    if (players.length === 0) {
      deletePlayerQueue(lobby.id)
    }
  }
}
