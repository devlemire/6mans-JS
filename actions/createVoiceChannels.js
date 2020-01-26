module.exports = (eventObj, queue) => {
  const { playersIdsIndexed } = queue
  const channel = eventObj.author.lastMessage.channel

  if (eventObj.guild.available) {
    channel.send('The guild is available.')
  } else {
    channel.send('No guild is available')
  }
}
