const randomNumber = require('../utils/randomNumber')
const createLobbyInfo = require('./createLobbyInfo')

module.exports = (eventObj, queue) => {
  const { players, teams } = queue

  while (teams.blue.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.blue.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  while (teams.orange.length !== 3) {
    const randomIndex = randomNumber(players.length - 1)
    teams.orange.push(players[randomIndex])
    players.splice(randomIndex, 1)
  }

  createLobbyInfo(eventObj, queue)
}
