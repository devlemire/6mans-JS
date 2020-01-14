const randomstring = require('randomstring')

let lobbyId = 0

function createQueue() {
  return {
    players: [],
    playerIdsIndexed: {},
    votes: {
      r: 0,
      c: 0,
      playersWhoVoted: [],
    },
    teams: {
      blue: {
        players: [],
        captain: undefined,
      },
      orange: {
        players: [],
        captain: undefined,
      },
    },
    lobby: {
      id: ++lobbyId,
      name: `smjs${lobbyId}`,
      password: randomstring.generate({ length: 3 }).toLowerCase(),
    },
  }
}

let queues = []

const determinePlayerQueue = (playerId, command, channel) => {
  if (queues.length === 0 && command === '!q') {
    const queue = createQueue()
    queues.push(queue)

    return queue
  } else if (queues.length === 0 && command !== '!q') {
    return undefined
  }

  const playersQueue = queues.find(queueObj => queueObj.playerIdsIndexed[playerId])

  if (playersQueue) {
    return playersQueue
  } else {
    // Player is not in a queue yet
    return queues.find(queueObj => queueObj.players.length < 6)
  }
}

const deletePlayerQueue = lobbyId => {
  if (typeof lobbyId !== 'number') return

  const queueIndex = queues.findIndex(queueObj => queueObj.lobby.id === lobbyId)
  queues.splice(queueIndex, 1)
}

module.exports = {
  determinePlayerQueue,
  deletePlayerQueue,
}
