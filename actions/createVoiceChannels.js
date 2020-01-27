module.exports = async (eventObj, queue) => {
  const { players, lobby, teams } = queue
  const channel = eventObj.author.lastMessage.channel
  const guild = eventObj.guild
  const parentChannel = guild.channels.find(channelObj => channelObj.name === process.env.channelName)
  const everyoneRole = guild.roles.find(roleObj => roleObj.name === '@everyone')

  // REMOVE ME
  teams.blue.players[0] = players[0]
  teams.orange.players[0] = players[0]
  // REMOVE ME

  if (guild.available) {
    channel.send('The guild is available.')

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

    teams.blue.voiceChannelID = blueVoiceChannel.id
    teams.orange.voiceChannelID = orangeVoiceChannel.id
  } else {
    channel.send('I do not have the premissions to make channels.')
  }
}
