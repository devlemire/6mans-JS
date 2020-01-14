module.exports = players =>
  players.map(userObj => `<@${userObj.id}>`).join(', ')
