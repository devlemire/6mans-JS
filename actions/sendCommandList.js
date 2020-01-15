module.exports = eventObj => {
  const channel = eventObj.author.lastMessage.channel

  channel.send({
    embed: {
      color: 2201331,
      title: '6-mans JS command list',
      description: 'All the possible commands.',
      fields: [
        { name: '!6m-q', value: 'Enter an existing or new 6mans queue' },
        { name: '!6m-leave', value: 'Leave your 6mans queue' },
        {
          name: '!6m-status',
          value: 'Display how many people are currently in the queue',
        },
        {
          name: '!6m-votestatus',
          value: 'Display how many people have voted and for which team structure',
        },
        {
          name: '!6m-votestatus',
          value: 'Display how many people have voted and for which team structure',
        },
        {
          name: '!6m-r',
          value: 'Vote for random team structure during the voting phase',
        },
        {
          name: '!6m-c',
          value: 'Vote for captain team structure during the voting phase',
        },
        {
          name: '!6m-help',
          value: 'Display all the commands the bot has to offer',
        },
      ],
    },
  })
}
