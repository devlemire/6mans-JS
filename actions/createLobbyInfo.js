const randomNumber = require('../utils/randomNumber')
const { deletePlayerQueue } = require('../utils/managePlayerQueues')

module.exports = (eventObj, queue) => {
  const { teams, lobby } = queue

  const randomTeam = randomNumber(1) === 0 ? 'blue' : 'orange'
  const randomPlayer = randomNumber(2)

  const creatorId = teams[randomTeam].players[randomPlayer].id

  function sendLobbyInfo(players) {
    players.forEach(player => {
      player.dmPlayer({
        embed: {
          color: 2201331,
          title: `Lobby ${lobby.name} - Ready`,
          description: 'Please join the correct voice channel based on your team',
          fields: [
            {
              name: 'Blue',
              value: teams.blue.players.map(playerObj => `<@${playerObj.id}>`).join(', '),
            },
            {
              name: 'Orange',
              value: teams.orange.players.map(playerObj => `<@${playerObj.id}>`).join(', '),
            },
            {
              name: 'Creates the lobby',
              value: `<@${creatorId}>`,
            },
          ],
        },
      })

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
          ],
        },
      })
    })
  }

  sendLobbyInfo(teams.blue.players)
  sendLobbyInfo(teams.orange.players)
  deletePlayerQueue(lobby.id)
}
