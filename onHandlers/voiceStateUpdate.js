const { determinePlayerQueue, deletePlayerQueue } = require('../utils/managePlayerQueues')

module.exports = (oldMember, newMember) => {
  const queue = determinePlayerQueue(newMember.user.id, undefined)
  const guild = newMember.guild

  // Player is not in a queue
  if (!queue) return

  // Player is in a queue
  const {
    teams: { blue, orange },
    lobby,
  } = queue

  // Track how many users joined the voice channels
  if (newMember.voiceChannelID === blue.voiceChannelID) {
    blue.voiceChannelHistory[newMember.user.id] = true
  }

  if (newMember.voiceChannelID === orange.voiceChannelID) {
    orange.voiceChannelHistory[newMember.user.id] = true
  }

  console.log('blue voice channel history', blue.voiceChannelHistory)
  console.log('orange voice channel history', orange.voiceChannelHistory)

  // Automatically delete the channels after all players have left their voice channels
  if (
    (oldMember.voiceChannelID === blue.voiceChannelID || oldMember.voiceChannelID === orange.voiceChannelID) &&
    (newMember.voiceChannelID !== blue.voiceChannelID || newMember.voiceChannelID !== orange.voiceChannelID)
  ) {
    // Check that all 3 members have joined the orange and blue voice channels
    if (Object.keys(blue.voiceChannelHistory).length >= 3 && Object.keys(orange.voiceChannelHistory).length >= 3) {
      const blueVoiceChannel = guild.channels.get(blue.voiceChannelID)
      const orangeVoiceChannel = guild.channels.get(orange.voiceChannelID)

      if (blueVoiceChannel.members.size === 0 && orangeVoiceChannel.members.size === 0) {
        // Delete the voice channels
        blueVoiceChannel.delete()
        orangeVoiceChannel.delete()

        // Delete the player queue
        deletePlayerQueue(lobby.id)
      }
    }
  }
}
