const randomNumber = require('../utils/randomNumber')
const createLobbyInfo = require('./createLobbyInfo')

const playersToMentions = players => {
  return players.map((playerObj, index) => `${index}: <@${playerObj.id}>`).join('\n')
}

module.exports = async (eventObj, queue) => {
  let { players, teams, lobby } = queue
  const channel = eventObj.channel
  queue.votingInProgress = false
  queue.creatingTeamsInProgress = true

  // Randomly choose Blue Captain
  const blueCaptainIndex = randomNumber(players.length - 1)
  teams.blue.players.push(players[blueCaptainIndex])
  teams.blue.captain = players[blueCaptainIndex]
  players.splice(blueCaptainIndex, 1)

  // Randomly choose Orange Captain
  const orangeCaptainIndex = randomNumber(players.length - 1)
  teams.orange.players.push(players[orangeCaptainIndex])
  teams.orange.captain = players[orangeCaptainIndex]
  players.splice(orangeCaptainIndex, 1)

  // Tell the server that captain mode was chosen
  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Captain structure`,
      description: 'The vote resulted in captain structure. The following are your captains:',
      fields: [
        { name: 'Captain Blue', value: `<@${teams.blue.captain.id}>` },
        { name: 'Captain Orange', value: `<@${teams.orange.captain.id}>` },
      ],
    },
  })

  // Randomly choose first and second pick
  const firstPick = randomNumber(1) === 0 ? 'blue' : 'orange'
  const secondPick = firstPick === 'blue' ? 'orange' : 'blue'

  // Direct message the first pick captain
  // First pick gets to select 1 player
  const message = await teams[firstPick].captain.dmPlayer(
    'Choose ONE player to be on your team by clicking an emoji:\n' + playersToMentions(players)
  )
  await message.react('0️⃣')
  await message.react('1️⃣')
  await message.react('2️⃣')
  await message.react('3️⃣')

  const firstPickCollector = message.createReactionCollector((reaction, user) => {
    const validReactions = ['0️⃣', '1️⃣', '2️⃣', '3️⃣']
    return validReactions.includes(reaction.emoji.name) && user.id === teams[firstPick].captain.id
  })

  firstPickCollector.on('collect', async reaction => {
    const emojiToIndex = {
      '0️⃣': 0,
      '1️⃣': 1,
      '2️⃣': 2,
      '3️⃣': 3,
    }

    teams[firstPick].players.push(players[emojiToIndex[reaction.emoji.name]])
    players.splice(emojiToIndex[reaction.emoji.name], 1)

    firstPickCollector.stop()

    // Direct message the second pick captain
    // Second pick gets to select 2 players
    const message = await teams[secondPick].captain.dmPlayer(
      'Choose TWO players to be on your team by clicking an emoji:\n' + playersToMentions(players)
    )
    await message.react('0️⃣')
    await message.react('1️⃣')
    await message.react('2️⃣')

    const secondPickCollector = message.createReactionCollector((reaction, user) => {
      const validReactions = ['0️⃣', '1️⃣', '2️⃣']
      return validReactions.includes(reaction.emoji.name) && user.id === teams[secondPick].captain.id
    })

    let pickCount = 0

    secondPickCollector.on('collect', reaction => {
      const player = players[emojiToIndex[reaction.emoji.name]]

      if (player) {
        teams[secondPick].players.push(players[emojiToIndex[reaction.emoji.name]])
        players[emojiToIndex[reaction.emoji.name]] = undefined
        pickCount += 1

        if (pickCount === 2) {
          // Assign the last remaining player in the first pick's team
          const player = players.find(playerObj => !!playerObj)
          teams[firstPick].players.push(player)
          players = []

          // Create the lobby
          createLobbyInfo(eventObj, queue)

          // Stop the emoji collector
          secondPickCollector.stop()
        }
      }
    })
  })
}
