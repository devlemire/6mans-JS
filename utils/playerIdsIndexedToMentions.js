module.exports = playerIdsIndexed =>
  Object.keys(playerIdsIndexed)
    .map(playerId => `<@${playerId}>`)
    .join(', ')
