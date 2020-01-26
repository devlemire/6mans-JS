module.exports = (eventObj, queue) => {
  const { players, votes, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const userIndexInPlayers = players.findIndex(playerObj => playerObj.id === playerId)
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  if (players.length === 0 || userIndexInPlayers === -1) {
    channel.send(`You have not entered the queue <@${playerId}>`)
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
