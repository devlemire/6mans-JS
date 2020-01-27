const { commandToString } = require('./commands')

module.exports = ({ playerId, channel, queue }) => {
  const { playerIdsIndexed } = queue

  if (!playerIdsIndexed[playerId]) {
    if (channel) {
      channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
    }

    return true
  } else {
    return false
  }
}
