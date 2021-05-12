const playerNotInQueue = require('../utils/playerNotInQueue')
const playerIdsIndexedToMentions = require('../utils/playerIdsIndexedToMentions')

module.exports = (eventObj, queue) => {
  const { players, playerIdsIndexed, lobby, votingInProgress, creatingTeamsInProgress, readyToJoin } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id
  const remainingPlayersRequired = 6 - players.length

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Status`,
      description: `${remainingPlayersRequired} players needed`,
      fields: [
        { name: 'Players in the queue', value: playerIdsIndexedToMentions(playerIdsIndexed) },
        { name: 'Voting', value: votingInProgress, inline: true },
        { name: 'Creating Teams', value: creatingTeamsInProgress, inline: true },
        { name: 'Lobby Ready', value: readyToJoin, inline: true },
      ],
    },
  })
}
