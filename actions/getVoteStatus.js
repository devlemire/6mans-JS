module.exports = (eventObj, { queue, votes }) => {
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const userIndexInQueue = queue.findIndex(userObj => userObj.id === userId)

  if (queue.length === 0 || userIndexInQueue === -1) {
    channel.send(`You have not entered the queue <@${userId}>`)
  } else {
    channel.send({
      embed: {
        color: 2201331,
        title: 'Vote status',
        description: 'The current vote count is:',
        fields: [
          { name: 'Random Teams', value: '0', inline: true },
          { name: 'Captains', value: '0', inline: true },
          { name: 'Balanced Teams', value: '0', inline: true },
        ],
      },
    })
  }
}
