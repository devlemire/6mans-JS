const createRandomTeams = require('./createRandomTeams')
const createCaptainTeams = require('./createCaptainTeams')
const randomNumber = require('../utils/randomNumber')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { votes, votingInProgress } = queue
  const channel = eventObj.channel
  const playerId = eventObj.author.id

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // The voting phase has not started yet
  if (!votingInProgress) {
    return channel.send(`You cannot vote because the voting phase is not in progress <@${playerId}>`)
  }

  // The voting phase has started
  // Player is in the queue
  const vote = eventObj.content
    .toLowerCase()
    .trim()
    .split('!')[1]
    .split('-')[1]

  if (!votes.playersWhoVoted[playerId]) {
    // The player has not voted yet
    votes[vote]++
    votes.playersWhoVoted[playerId] = true

    // Check to see if majority of the votes are for 1 team structure
    // This saves time of waiting for all 6 voters
    const numberOfVoters = Object.keys(votes.playersWhoVoted).length

    if (numberOfVoters >= 4 && numberOfVoters < 6) {
      if (votes.r >= 4) {
        // Random Structure has the majority
        createRandomTeams(eventObj, queue)
      } else if (votes.c >= 4) {
        // Captain Structure has the majority
        createCaptainTeams(eventObj, queue)
      }
    }
  } else {
    // The player has already voted
    channel.send(`You cannot vote because you already voted <@${playerId}>`)
  }

  // Check to see if all 6 votes have been set and then determine the team structure
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
}
