const randomNumber = require('../utils/randomNumber')
const createLobbyInfo = require('./createLobbyInfo')

module.exports = (eventObj, queue) => {
  const { players, teams } = queue

  while (teams.blue.players.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.blue.players.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  while (teams.orange.players.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.orange.players.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  createLobbyInfo(eventObj, queue)
}
