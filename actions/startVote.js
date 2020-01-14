const playersToMentions = require('../utils/playersToMentions')

module.exports = (eventObj, queue) => {
  const { players } = queue
  const channel = eventObj.author.lastMessage.channel

  channel.send(playersToMentions(players))

  channel.send({
    embed: {
      color: 2201331,
      title: '6 players found',
      description: 'Please vote for your desired team structure.',
      fields: [
        { name: 'Vote for random teams', value: '!r', inline: true },
        { name: 'Vote for captains', value: '!c', inline: true },
        {
          name: 'Vote Status',
          value: 'You can check the vote status by typing !votestatus',
        },
      ],
    },
  })
}
