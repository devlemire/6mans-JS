const randomNumber = require('../utils/randomNumber')
const createLobbyInfo = require('./createLobbyInfo')

module.exports = (eventObj, queue) => {
  const { players, teams } = queue
  const channel = eventObj.author.lastMessage.channel

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

  // Randomly choose first and second pick
  const firstPick = randomNumber(1) === 0 ? 'blue' : 'orange'
  const secondPick = firstPick === 'blue' ? 'orange' : 'blue'

  // Direct message the first pick captain
  // First pick gets to select 1 player
  teams[firstPick].captain.dmPlayer('test')

  // Direct message the second pick captain
  // Second pick gets to select 2 players

  // Assign the last remaining player in the first pick's team

  channel.send('captain teams executed')
  // createLobbyInfo()
}
