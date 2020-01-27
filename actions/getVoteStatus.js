const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { playerIdsIndexed, votingInProgress, votes, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  // Voting is not in progress
  if (!votingInProgress) {
    return channel.send(`You cannot vote because the voting phase is not in progress <@${playerId}>`)
  }

  // Voting is in progress
  // Get a list of mentions for the players who haven't voted
  const playersWhoHaventVoted = Object.keys(playerIdsIndexed)
    .map(playerId => {
      if (!votes.playersWhoVoted[playerId]) {
        return `<@${playerId}>`
      }

      return undefined
    })
    .filter(mentionString => mentionString !== undefined)

  // Voting is in progress
  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Vote status`,
      description: `${remainingVotesRequired} votes remaining`,
      fields: [
        { name: 'Needs to Vote', value: playersWhoHaventVoted.join(', ') },
        { name: 'Random Teams', value: votes.r, inline: true },
        { name: 'Captains', value: votes.c, inline: true },
      ],
    },
  })
}
