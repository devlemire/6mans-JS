const { commandToString } = require('../utils/commands')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { players, votes, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  if (playerNotInQueue(playerId, queue)) {
    // Player is not in the queue
    return channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  } else if (players.length < 6) {
    // Voting does not start until 6 players are found
    return channel.send(`6 players have not been found yet.`)
  }

  // Player is in the queue and voting is in progress
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
