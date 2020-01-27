const playerNotInQueue = require('../utils/playerNotInQueue')

const playerIdsIndexedToMentions = playerIdsIndexed =>
  Object.keys(playerIdsIndexed)
    .map(playerId => `<@${playerId}>`)
    .join(', ')

module.exports = (eventObj, queue) => {
  const { players, playerIdsIndexed, lobby, votingInProgress, creatingTeamsInProgress } = queue
  const channel = eventObj.author.lastMessage.channel
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
        { name: 'Voting in progress', value: votingInProgress, inline: true },
        { name: 'Creating teams in progress', value: creatingTeamsInProgress, inline: true },
      ],
    },
  })
}
