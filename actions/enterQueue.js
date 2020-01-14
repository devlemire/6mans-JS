const startVote = require('./startVote')

module.exports = (eventObj, queue) => {
  const { players } = queue
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const username = eventObj.author.username
  const dmPlayer = msg => eventObj.author.send(msg)

  if (players.length === 0) {
    // REMOVE ME WHEN DEBUGGING COMPLETE
    players.push(
      ...Array.from({ length: 6 }).map(_ => {
        return { id: userId, username, dmPlayer }
      })
    )
    // REMOVE ME WHEN DEBUGGING COMPLETE

    // players.push({ id: userId, username, dmPlayer })

    if (players.length === 6) {
      startVote(eventObj, queue)
    } else {
      channel.send(`You have entered the queue <@${userId}>`)
    }
  } else {
    const isInQueue = players.some(userObj => userObj.id === userId)

    if (isInQueue) {
      channel.send(`You are already in the queue <@${userId}>`)
    } else {
      players.push({ id: userId, username, dmPlayer })
      channel.send(`You have entered the queue <@${userId}>`)
    }
  }
}
