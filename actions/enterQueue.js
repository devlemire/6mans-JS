const startVote = require('./startVote')

module.exports = (eventObj, { queue }) => {
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const username = eventObj.author.username

  if (queue.length === 0) {
    // REMOVE ME WHEN DEBUGGING COMPLETE
    queue.push(
      ...Array.from({ length: 6 }).map(_ => {
        return { id: userId, username }
      })
    )
    // REMOVE ME WHEN DEBUGGING COMPLETE

    // queue.push({ id: userId, username })

    if (queue.length === 6) {
      startVote(eventObj, { queue })
    } else {
      channel.send(`You have entered the queue <@${userId}>`)
    }
  } else {
    const isInQueue = queue.some(userObj => userObj.id === userId)

    if (isInQueue) {
      channel.send(`You are already in the queue <@${userId}>`)
    } else {
      queue.push({ id: userId, username })
      channel.send(`You have entered the queue <@${userId}>`)
    }
  }
}
