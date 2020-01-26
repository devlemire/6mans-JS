const playersToMentions = require('../utils/playersToMentions')
const { commandToString } = require('../utils/commands')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { players, lobby, votingInProgress, creatingTeamsInProgress } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const remainingPlayersRequired = 6 - players.length

  if (playerNotInQueue(playerId, queue)) {
    // Player is not in the queue
    return channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  }

  // Player is in the queue
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
