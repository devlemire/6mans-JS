const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { playerIdsIndexed, votingInProgress, creatingTeamsInProgress, readyToJoin, votes, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  if (!votingInProgress && !creatingTeamsInProgress && !readyToJoin) {
    // Voting has not started yet
    return channel.send(`The voting phase has not started yet <@${playerId}>`)
  }

  // Voting has started already
  // Get a list of mentions for the players who haven't voted
  let playersWhoHaventVoted = Object.keys(playerIdsIndexed)
    .map(playerId => {
      if (!votes.playersWhoVoted[playerId]) {
        return `<@${playerId}>`
      }

      return undefined
    })
    .filter(mentionString => mentionString !== undefined)

  if (playersWhoHaventVoted.length > 0) {
    // Display the players who need to vote
    playersWhoHaventVoted.join(', ')
  } else {
    // Display blank - No player needs to vote
    playersWhoHaventVoted = ''
  }

  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Vote status`,
      description: `${remainingVotesRequired} votes remaining`,
      fields: [
        { name: 'Needs to Vote', value: playersWhoHaventVoted },
        { name: 'Random Teams', value: votes.r, inline: true },
        { name: 'Captains', value: votes.c, inline: true },
      ],
    },
  })
}
