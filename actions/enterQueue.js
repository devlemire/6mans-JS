const startVote = require('./startVote')

module.exports = (eventObj, queue) => {
  const { players, playerIdsIndexed } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id
  const username = eventObj.author.username
  const dmPlayer = async (msg) => await eventObj.author.send(msg)

  // Check to see if the player is already in the queue
  const isInQueue = playerIdsIndexed[playerId]

  // The player is already in the queue
  if (isInQueue) return channel.send(`You are already in the queue <@${playerId}>`)

  // The player is not in the queue
  players.push({ id: playerId, username, dmPlayer })
  playerIdsIndexed[playerId] = true

  if (process.env.NODE_ENV === 'develop') {
    const fakePlayers = []

    for (let i = 0; i < 5; i++) {
      fakePlayers.push({ id: i, username: `bot-${i}`, dmPlayer })
      playerIdsIndexed[i] = true
    }

    players.push(...fakePlayers)
  }

  // Notify the player that they have joined the queue
  channel.send(`You have entered the queue <@${playerId}>`)

  // Check to see if 6 players have queued now
  if (Object.keys(playerIdsIndexed).length === 6) {
    // 6 players queued, start the voting phase
    startVote(eventObj, queue)
  }
}
