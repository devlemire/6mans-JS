const playersToMentions = require('../utils/playersToMentions')
const { commandToString } = require('../utils/commands')

module.exports = (eventObj, queue) => {
  const { players, lobby, votingInProgress, creatingTeamsInProgress } = queue
  const channel = eventObj.author.lastMessage.channel

  if (players.length === 0) {
    channel.send(`The queue is currently empty! Type ${commandToString.queue} to join.`)
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
