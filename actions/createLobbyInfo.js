const randomNumber = require('../utils/randomNumber')
const createVoiceChannels = require('./createVoiceChannels')
const { lobbyRegion, lobbySeries } = process.env

module.exports = async (eventObj, queue) => {
  const { teams, lobby } = queue
  const channel = eventObj.channel

  const randomTeam = randomNumber(1) === 0 ? 'blue' : 'orange'
  const randomPlayer = randomNumber(2)

  const creatorId = teams[randomTeam].players[randomPlayer].id

  const readyEmbed = {
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Ready`,
      description: 'Please join the correct voice channel based on your team',
      fields: [
        {
          name: 'Blue',
          value: teams.blue.players.map((playerObj) => `<@${playerObj.id}>`).join(', '),
        },
        {
          name: 'Orange',
          value: teams.orange.players.map((playerObj) => `<@${playerObj.id}>`).join(', '),
        },
        {
          name: 'Creates the lobby',
          value: `<@${creatorId}>`,
        },
      ],
    },
  }

  function sendLobbyInfo(players) {
    players.forEach((player) => {
      player.dmPlayer(readyEmbed)

      player.dmPlayer({
        embed: {
          color: 2201331,
          title: `Lobby ${lobby.name} - Details`,
          description: 'Use this information to join the private match',
          fields: [
            {
              name: 'Lobby Name',
              value: lobby.name,
            },
            {
              name: 'Lobby Password',
              value: lobby.password,
            },
            {
              name: 'Series Length (mutator)',
              value: lobbySeries,
            },
            {
              name: 'Region',
              value: lobbyRegion,
            },
          ],
        },
      })
    })
  }

  // Create Voice Channels for each team
  await createVoiceChannels(eventObj, queue)
  console.log(`createVoiceChannel finished, queue:`, queue)

  // DM Blue Team
  sendLobbyInfo(teams.blue.players)
  // DM Orange Team
  sendLobbyInfo(teams.orange.players)

  // Inform the channel that everything is ready
  channel.send(readyEmbed)

  // Set the ready to go flag to true
  queue.votingInProgress = false
  queue.creatingTeamsInProgress = false
  queue.readyToJoin = true
}
