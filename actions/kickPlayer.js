const playerNotInQueue = require('../utils/playerNotInQueue')
const { kickPlayer } = require('../utils/managePlayerQueues')

module.exports = async (eventObj, queue) => {
  const { players, lobby, playerIdsIndexed } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // There aren't 6 players in the queue
  if (players.length !== 6) {
    return channel.send(`A vote to kick cannot be started until the queue is full <@${playerId}>`)
  }

  // There are 6 players in the queue
  // Create emoji dictionary
  const validReactions = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
  const emojiToIndex = {
    '0️⃣': 0,
    '1️⃣': 1,
    '2️⃣': 2,
    '3️⃣': 3,
    '4️⃣': 4,
    '5️⃣': 5,
  }

  // Create a list of all the kickable players
  const fields = []

  players.forEach((playerObj, playerIndex) => {
    fields.push({ name: playerObj.username, value: validReactions[playerIndex], inline: true })
  })

  // Send the vote to kick message
  const message = await channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Kick vote`,
      description:
        'A vote to kick has been started. Majority of the lobby will have to vote for the same player to be kicked.',
      fields,
    },
  })

  for (let i = 0; i < players.length; i++) {
    await message.react(validReactions[i])
  }

  const reactionCollector = message.createReactionCollector((reaction, user) => {
    return validReactions.includes(reaction.emoji.name) && playerIdsIndexed[user.id]
  })

  reactionCollector.on('collect', (reaction) => {
    // Add 2 to the majority because the Bot counts as 1 vote
    const majority = process.env.NODE_ENV === 'develop' ? 2 : players.length / 2 + 2
    const reactions = reaction.message.reactions

    reactions.forEach((reactionObj) => {
      if (Number(reactionObj.count) >= majority) {
        const playerToKickIndex = emojiToIndex[reactionObj.emoji.name]

        kickPlayer(playerToKickIndex, queue, (msg) => channel.send(msg))

        reactionCollector.stop()
      }
    })
  })
}
