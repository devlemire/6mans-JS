const playersToMentions = require('../utils/playersToMentions')

module.exports = (eventObj, queue) => {
  const { players } = queue
  const channel = eventObj.author.lastMessage.channel

  if (queue.length === 0) {
    channel.send('The queue is currently empty! Type !q to join.')
  } else {
    channel.send('The current queue is: ' + playersToMentions(players))
  }
}
