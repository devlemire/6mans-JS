module.exports = queue => queue.map(userObj => `<@${userObj.id}>`).join(', ')
