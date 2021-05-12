const { commandToString } = require('../utils/commands')

module.exports = (eventObj) => {
  const channel = eventObj.channel

  channel.send({
    embed: {
      color: 2201331,
      title: '6-mans JS command list',
      description: 'All the possible commands.',
      fields: [
        { name: commandToString.queue, value: 'Enter an existing or new 6mans queue' },
        { name: commandToString.leave, value: 'Leave your 6mans queue' },
        {
          name: commandToString.status,
          value: 'Display how many people are currently in the queue',
        },
        {
          name: commandToString.votestatus,
          value: 'Display how many people have voted and for which team structure',
        },
        {
          name: commandToString.r,
          value: 'Vote for random team structure during the voting phase',
        },
        {
          name: commandToString.c,
          value: 'Vote for captain team structure during the voting phase',
        },
        {
          name: commandToString.help,
          value: 'Display all the commands the bot has to offer',
        },
        {
          name: commandToString.kick,
          value: 'Vote to kick an AFK player',
        },
      ],
    },
  })
}
