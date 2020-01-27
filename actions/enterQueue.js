const startVote = require('./startVote')

module.exports = (eventObj, queue) => {
  const { players, playerIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const username = eventObj.author.username
  const dmPlayer = async msg => await eventObj.author.send(msg)

  if (players.length === 0) {
    players.push({ id: playerId, username, dmPlayer })
    playerIdsIndexed[playerId] = true
    channel.send(`You have entered the queue <@${playerId}>`)
  } else {
    const isInQueue = playerIdsIndexed[playerId]

    if (isInQueue) {
      channel.send(`You are already in the queue <@${playerId}>`)
    } else {
      players.push({ id: playerId, username, dmPlayer })
      playerIdsIndexed[playerId] = true
      channel.send(`You have entered the queue <@${playerId}>`)

      if (players.length === 6) {
        startVote(eventObj, queue)
      }
    }
  }
}
