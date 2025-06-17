// In-memory store; replace with DB later
const userStates = {};

function getUserState(user) {
  return userStates[user];
}

function setUserState(user, state) {
  userStates[user] = state;
}

module.exports = { getUserState, setUserState };
