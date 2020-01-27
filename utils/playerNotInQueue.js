const { commandToString } = require('./commands')

module.exports = ({ playerId, channel, queue }) => {
  const { players, playerIdsIndexed } = queue

  if (players.length === 0 || !playerIdsIndexed[playerId]) {
    if (channel) {
      channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
    }

    return true
  } else {
    return false
  }
}
