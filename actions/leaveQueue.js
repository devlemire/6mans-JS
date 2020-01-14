module.exports = (eventObj, queue) => {
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const userIndexInQueue = queue.findIndex(userObj => userObj.id === userId)

  if (queue.length === 0 || userIndexInQueue === -1) {
    channel.send(`You have not entered the queue <@${userId}>`)
  } else {
    queue.splice(userIndexInQueue, 1)
    channel.send(`You have left the queue <@${userId}>`)
  }
}
