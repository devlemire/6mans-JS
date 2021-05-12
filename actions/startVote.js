const playerIdsIndexedToMentions = require('../utils/playerIdsIndexedToMentions')
const { commandToString } = require('../utils/commands')

module.exports = (eventObj, queue) => {
  const { playerIdsIndexed, lobby } = queue
  const channel = eventObj.channel
  queue.votingInProgress = true

  channel.send(playerIdsIndexedToMentions(playerIdsIndexed))

  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - 6 players found`,
      description: 'Please vote for your desired team structure.',
      fields: [
        { name: 'Vote for random teams', value: commandToString.r, inline: true },
        { name: 'Vote for captains', value: commandToString.c, inline: true },
        {
          name: 'Vote Status',
          value: `You can check the vote status by typing ${commandToString.votestatus}`,
        },
      ],
    },
  })
}
