const randomstring = require('randomstring')
const playersToMentions = require('../utils/playersToMentions')

let lobbyId = 0

function createQueue() {
  return {
    players: [],
    playerIdsIndexed: {},
    votingInProgress: false,
    votes: {
      r: 0,
      c: 0,
      playersWhoVoted: [],
    },
    creatingTeamsInProgress: false,
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
  if (queues.length === 0 && command === '!6m-q') {
    const queue = createQueue()
    queues.push(queue)

    return queue
  } else if (queues.length === 0 && command !== '!6m-q') {
    return undefined
  }

  const playersQueue = queues.find(queueObj => queueObj.playerIdsIndexed[playerId])

  if (playersQueue) {
    return playersQueue
  } else {
    // Player is not in a queue yet
    const notFullQueue = queues.find(queueObj => queueObj.players.length < 6)

    if (notFullQueue) {
      return notFullQueue
    } else {
      const queue = createQueue()
      queues.push(queue)

      return queue
    }
  }
}

const deletePlayerQueue = lobbyId => {
  if (typeof lobbyId !== 'number') return

  const queueIndex = queues.findIndex(queueObj => queueObj.lobby.id === lobbyId)
  queues.splice(queueIndex, 1)
}

const removeOfflinePlayerFromQueue = ({ playerId, playerChannels }) => {
  if (queues.length === 0) return

  const playersQueue = queues.find(queueObj => queueObj.playerIdsIndexed[playerId])

  if (!playersQueue) return

  // The player is in a queue but logged out without leaving the queue
  playersQueue.players = playersQueue.players.filter(playerObj => playerObj.id !== playerId)
  delete playersQueue.playerIdsIndexed[playerId]

  const channel = playerChannels.find(channelObj => channelObj.name === process.env.channelName)

  if (playersQueue.players.length === 0) {
    // No players are in the queue now
    deletePlayerQueue(playersQueue.lobby.id)
  } else {
    // Notify the other players in the queue of the removal
    if (channel) {
      channel.send({
        embed: {
          color: 2201331,
          title: `Lobby ${playersQueue.lobby.name}`,
          description: `<@${playerId}> was removed from the queue because they went offline.`,
          fields: [
            { name: 'Players in the queue', value: playersToMentions(playersQueue.players) },
            { name: 'Voting in progress', value: playersQueue.votingInProgress, inline: true },
            { name: 'Creating teams in progress', value: playersQueue.creatingTeamsInProgress, inline: true },
          ],
        },
      })
    }
  }
}

module.exports = {
  determinePlayerQueue,
  deletePlayerQueue,
  removeOfflinePlayerFromQueue,
}
