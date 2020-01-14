const randomNumber = require('../utils/randomNumber')

module.exports = (eventObj, queue) => {
  const { teams, lobby } = queue

  const randomTeam = randomNumber(1)
  const randomPlayer = randomNumber(2)
  const indexToTeam = ['blue', 'orange']

  const creatorId = teams[indexToTeam[randomTeam]][randomPlayer].id

  function sendLobbyInfo(players) {
    players.forEach(player => {
      player.dmPlayer({
        embed: {
          color: 2201331,
          title: `Lobby #${lobby.id} is ready!`,
          description: 'Please join the correct voice channel based on your team',
          fields: [
            {
              name: 'Blue',
              value: teams.blue.map(playerObj => `<@${playerObj.id}>`).join(', '),
            },
            {
              name: 'Orange',
              value: teams.orange.map(playerObj => `<@${playerObj.id}>`).join(', '),
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
          title: `Lobby Details`,
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

  sendLobbyInfo(teams.blue)
  sendLobbyInfo(teams.orange)
}
