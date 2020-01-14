module.exports = (eventObj, { queue }) => {
  const channel = eventObj.author.lastMessage.channel
  channel.send('captain teams executed')
}
