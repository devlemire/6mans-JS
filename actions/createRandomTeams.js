const randomNumber = require('../utils/randomNumber')
const createLobbyInfo = require('./createLobbyInfo')

module.exports = (eventObj, queue) => {
  const { lobby, players, teams } = queue
  const channel = eventObj.channel
  queue.votingInProgress = false
  queue.creatingTeamsInProgress = true

  // Tell the server that random mode was chosen
  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Random structure`,
      description: 'The vote resulted in random structure. You will receive a DM when the teams are automatially created.',
    },
  })

  // Create blue team
  while (teams.blue.players.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.blue.players.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  // Create orange team
  while (teams.orange.players.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.orange.players.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  // Create the lobby
  createLobbyInfo(eventObj, queue)
}
