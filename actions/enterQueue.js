module.exports = (eventObj, queue) => {
  const channel = eventObj.author.lastMessage.channel

  if (queue.length === 0) {
    queue.push({ id: eventObj.author.id, username: eventObj.author.username })
    channel.send(`You have entered the queue <@${eventObj.author.id}>`)
  }
}
