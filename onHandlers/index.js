const message = require('./message')
const voiceStateUpdate = require('./voiceStateUpdate')

module.exports = {
  messageHandler: message,
  voiceStateUpdateHandler: voiceStateUpdate,
}
