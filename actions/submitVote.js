const createRandomTeams = require('./createRandomTeams')
const createCaptainTeams = require('./createCaptainTeams')
const randomNumber = require('../utils/randomNumber')
const { commandToString } = require('../utils/commands')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { votes } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id

  if (playerNotInQueue(playerId, queue)) {
    // Player is not in the queue
    return channel.send(`You have not entered the queue <@${playerId}>. Type ${commandToString.queue} to join!`)
  }

  // Player is in the queue
  const vote = eventObj.content
    .toLowerCase()
    .trim()
    .split('!')[1]
    .split('-')[1]

  if (!votes.playersWhoVoted[playerId]) {
    votes[vote]++
    votes.playersWhoVoted[playerId] = true
  } else {
    channel.send(`You cannot vote because you already voted <@${playerId}>`)
  }
}

if (votes.c + votes.r === 6) {
  if (votes.r > votes.c) {
    createRandomTeams(eventObj, queue)
  } else if (votes.c > votes.r) {
    createCaptainTeams(eventObj, queue)
  } else {
    const random = randomNumber(1)

    channel.send(`The voting resulted in a tie. I will choose the team structure at random.`)

    if (random === 0) {
      createRandomTeams(eventObj, queue)
    } else if (random === 1) {
      createCaptainTeams(eventObj, queue)
    } else {
      channel.send(`The universe just exploded...`)
    }
  }
}
