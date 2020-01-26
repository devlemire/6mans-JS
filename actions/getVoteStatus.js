const { commandToString } = require('../utils/commands')

module.exports = (eventObj, queue) => {
  const { players, votes, lobby, playerIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const playerInQueue = playerIdsIndexed[playerId]
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  if (players.length === 0 || !playerInQueue) {
    channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  } else if (players.length < 6) {
    channel.send(`6 players have not been found yet.`)
  } else {
    channel.send({
      embed: {
        color: 2201331,
        title: `Lobby ${lobby.name} - Vote status`,
        description: `${remainingVotesRequired} votes remaining`,
        fields: [
          { name: 'Random Teams', value: votes.r, inline: true },
          { name: 'Captains', value: votes.c, inline: true },
        ],
      },
    })
  }
}
