const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { playerIdsIndexed, votingInProgress, creatingTeamsInProgress, readyToJoin, votes, lobby } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  if (!votingInProgress && !creatingTeamsInProgress && !readyToJoin) {
    // Voting has not started yet
    return channel.send(`The voting phase has not started yet <@${playerId}>`)
  }

  // Voting has started already
  let remainingVotesRequired = 6 - (votes.r + votes.c)
  let playersWhoHaventVoted

  if (!votingInProgress) {
    // The voting phase has already passed
    playersWhoHaventVoted = ''
    remainingVotesRequired = 0
  } else {
    // The voting phase is currently in progress
    // Get a list of mentions for the players who haven't voted
    playersWhoHaventVoted = Object.keys(playerIdsIndexed)
      .map(playerId => {
        if (!votes.playersWhoVoted[playerId]) {
          return `<@${playerId}>`
        }

        return undefined
      })
      .filter(mentionString => mentionString !== undefined)
      .join(',')
  }

  let fields = [
    { name: 'Random Teams', value: votes.r, inline: true },
    { name: 'Captains', value: votes.c, inline: true },
  ]

  if (playersWhoHaventVoted) {
    fields.unshift({ name: 'Needs to Vote', value: playersWhoHaventVoted })
  }

  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Vote status`,
      description: `${remainingVotesRequired} votes remaining`,
      fields,
    },
  })
}
