const createRandomTeams = require('./createRandomTeams')
const createCaptainTeams = require('./createCaptainTeams')
const randomNumber = require('../utils/randomNumber')

module.exports = (eventObj, queue) => {
  const { players, votes } = queue
  const channel = eventObj.author.lastMessage.channel
  const userId = eventObj.author.id
  const userIndexInPlayers = players.findIndex(userObj => userObj.id === userId)

  if (players.length === 0 || userIndexInPlayers === -1) {
    channel.send(`You cannot vote because you aren't in the queue <@${userId}>`)
  } else {
    const vote = eventObj.content
      .toLowerCase()
      .trim()
      .split('!')[1]

    if (!votes.playersWhoVoted[userId]) {
      // REMOVE ME WHEN DEBUGGING COMPLETE
      votes[vote] = 6
      // REMOVE ME WHEN DEBUGGING COMPLETE

      // votes[vote]++
      votes.playersWhoVoted[userId] = true
    } else {
      channel.send(`You cannot vote because you already voted <@${userId}>`)
    }
  }

  if (votes.c + votes.r === 6) {
    queue.teamCreationInProgress = true

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
}
