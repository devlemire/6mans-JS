const playersToMentions = require('../utils/playersToMentions')
const { commandToString } = require('../utils/commands')

module.exports = (eventObj, queue) => {
  const { players, lobby, votingInProgress, creatingTeamsInProgress, playerIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const playerInQueue = playerIdsIndexed[playerId]

  if (players.length === 0 || !playerInQueue) {
    channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  } else {
    const remainingPlayersRequired = 6 - players.length

    channel.send({
      embed: {
        color: 2201331,
        title: `Lobby ${lobby.name} - Status`,
        description: `${remainingPlayersRequired} players needed`,
        fields: [
          { name: 'Players in the queue', value: playersToMentions(players) },
          { name: 'Voting in progress', value: votingInProgress, inline: true },
          { name: 'Creating teams in progress', value: creatingTeamsInProgress, inline: true },
        ],
      },
    })
  }
}
