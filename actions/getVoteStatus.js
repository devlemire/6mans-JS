module.exports = (eventObj, queue) => {
  const { players, votes } = queue
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const userIndexInPlayers = players.findIndex(userObj => userObj.id === userId)
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  if (players.length === 0 || userIndexInPlayers === -1) {
    channel.send(`You have not entered the queue <@${userId}>`)
  } else {
    channel.send({
      embed: {
        color: 2201331,
        title: `Vote status - ${remainingVotesRequired} votes remaining`,
        description: 'The current vote count is:',
        fields: [
          { name: 'Random Teams', value: votes.r, inline: true },
          { name: 'Captains', value: votes.c, inline: true },
        ],
      },
    })
  }
}
