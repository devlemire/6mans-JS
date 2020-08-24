const randomstring = require('randomstring')
const playerIdsIndexedToMentions = require('../utils/playerIdsIndexedToMentions')
const { commandToString } = require('./commands')
const { lobbyName } = process.env
const cloneDeep = require('lodash.clonedeep')

let lobbyId = 0

const queueResetValues = {
  votingInProgress: false,
  votes: {
    r: 0,
    c: 0,
    playersWhoVoted: {},
  },
  creatingTeamsInProgress: false,
  teams: {
    blue: {
      players: [],
      captain: undefined,
      voiceChannelID: undefined,
      voiceChannelHistory: {},
    },
    orange: {
      players: [],
      captain: undefined,
      voiceChannelID: undefined,
      voiceChannelHistory: {},
    },
  },
  readyToJoin: false,
}

function createQueue() {
  return {
    players: [],
    playerIdsIndexed: {},
    ...cloneDeep(queueResetValues),
    lobby: {
      id: ++lobbyId,
      name: `${lobbyName}${lobbyId}`,
      password: randomstring.generate({ length: 3 }).toLowerCase(),
    },
  }
}

let queues = []

const determinePlayerQueue = (playerId, command) => {
  if (queues.length === 0 && command === commandToString.queue) {
    // They are no existing queues yet, make the first one
    const queue = createQueue()
    queues.push(queue)

    return queue
  } else if (queues.length === 0 && command !== commandToString.queue) {
    // There are no existing queues yet, but player did not try to queue
    return undefined
  }

  // There are existing queues
  // Attempt to find player's queue
  const playersQueue = queues.find((queueObj) => queueObj.playerIdsIndexed[playerId])

  // Player is already in a queue
  if (playersQueue) return playersQueue

  // Player is not in a queue yet
  if (!playersQueue && command === commandToString.queue) {
    const notFullQueue = queues.find((queueObj) => Object.keys(queueObj.playerIdsIndexed).length < 6)

    // Player can join an existing queue
    if (notFullQueue) return notFullQueue

    // Player needs a new queue to be created for them
    const queue = createQueue()
    queues.push(queue)

    return queue
  } else {
    // Player is not in a queue and did not attempt to queue
    return undefined
  }
}

const deletePlayerQueue = (lobbyId) => {
  if (typeof lobbyId !== 'number') return

  const queueIndex = queues.findIndex((queueObj) => queueObj.lobby.id === lobbyId)
  queues.splice(queueIndex, 1)
}

const removeOfflinePlayerFromQueue = ({ playerId, playerChannels }) => {
  if (queues.length === 0) return

  const playersQueue = queues.find((queueObj) => queueObj.playerIdsIndexed[playerId])

  if (!playersQueue) return

  // The player is in a queue but logged out without leaving the queue
  playersQueue.players = playersQueue.players.filter((playerObj) => playerObj.id !== playerId)
  delete playersQueue.playerIdsIndexed[playerId]

  const channel = playerChannels.find((channelObj) => channelObj.name === process.env.channelName)

  if (Object.keys(playersQueue.playerIdsIndexed).length === 0) {
    // No players are in the queue now
    deletePlayerQueue(playersQueue.lobby.id)
  } else {
    // Notify the other players in the queue of the removal
    if (channel) {
      channel.send({
        embed: {
          color: 2201331,
          title: `Lobby ${playersQueue.lobby.name} - Player removed`,
          description: `<@${playerId}> was removed from the queue because they went offline.`,
          fields: [
            { name: 'Players in the queue', value: playerIdsIndexedToMentions(playersQueue.playerIdsIndexed) },
            { name: 'Voting in progress', value: playersQueue.votingInProgress, inline: true },
            { name: 'Creating teams in progress', value: playersQueue.creatingTeamsInProgress, inline: true },
            { name: 'Lobby Ready', value: playersQueue.readyToJoin, inline: true },
          ],
        },
      })
    }
  }
}

const kickPlayer = (playerIndex, queue, messageChannel) => {
  const playerObj = queue.players[playerIndex]
  const playerId = playerObj.id

  delete queue.playerIdsIndexed[playerId]
  queue.players.splice(playerIndex, 1)

  if (messageChannel) {
    messageChannel(`<@${playerId}> has been kicked. You can check the lobby status with ${commandToString.status}`)
  }

  resetPlayerQueue(queue.lobby.id)
}

const resetPlayerQueue = (lobbyId) => {
  const queueIndex = queues.findIndex((queueObj) => queueObj.lobby.id === lobbyId)
  queues[queueIndex] = Object.assign({}, queues[queueIndex], cloneDeep(queueResetValues))
}

module.exports = {
  determinePlayerQueue,
  deletePlayerQueue,
  removeOfflinePlayerFromQueue,
  kickPlayer,
  resetPlayerQueue,
}
