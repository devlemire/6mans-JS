module.exports = (playerId, queue) => {
  const { players, playerIdsIndexed } = queue

  if (players.length === 0 || !playerIdsIndexed[playerId]) {
    return true
  } else {
    return false
  }
}
