module.exports = async (eventObj, queue) => {
  const { lobby, teams } = queue
  const channel = eventObj.channel
  const guild = eventObj.guild
  const parentChannel = guild.channels.find(
    channelObj => channelObj.name === process.env.categoryName && channelObj.type === 'category'
  )
  const everyoneRole = guild.roles.find(roleObj => roleObj.name === '@everyone')

  console.log('categoryName', process.env.categoryName)
  console.log('parentChannel', parentChannel.id)
  console.log('everyoneRole', everyoneRole.id)
  console.log('blue team players', teams.blue.players)
  console.log('orange team players', teams.orange.players)

  if (guild.available) {
    const blueVoiceChannel = await guild.createChannel(`${lobby.name}-blue`, {
      parent: parentChannel.id,
      topic: `${lobby.name} - Team Blue Coms`,
      userLimit: 3,
      type: 'voice',
      permissionOverwrites: [
        {
          id: everyoneRole.id,
          deny: ['CONNECT', 'SPEAK', 'CREATE_INSTANT_INVITE'],
        },
        ...teams.blue.players.map(playerObj => {
          return {
            id: playerObj.id,
            allow: ['CONNECT', 'SPEAK'],
          }
        }),
      ],
    })

    const orangeVoiceChannel = await guild.createChannel(`${lobby.name}-orange`, {
      parent: parentChannel.id,
      topic: `${lobby.name} - Team Orange Coms`,
      userLimit: 3,
      type: 'voice',
      permissionOverwrites: [
        {
          id: everyoneRole.id,
          deny: ['CONNECT', 'SPEAK', 'CREATE_INSTANT_INVITE'],
        },
        ...teams.orange.players.map(playerObj => {
          return {
            id: playerObj.id,
            allow: ['CONNECT', 'SPEAK'],
          }
        }),
      ],
    })

    console.log('blue voice channel is being set to', blueVoiceChannel.id)
    console.log('orange voice channel is being set to', orangeVoiceChannel.id)

    teams.blue.voiceChannelID = blueVoiceChannel.id
    teams.orange.voiceChannelID = orangeVoiceChannel.id
  } else {
    channel.send('I do not have the premissions to make channels.')
  }
}
