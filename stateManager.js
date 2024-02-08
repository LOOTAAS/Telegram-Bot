const userStates = {};

const setUserState = (userId, state) => {
    userStates[userId] = state;
};

const getUserState = (userId) => {
    return userStates[userId];
};

const updateUserState = (userId, newState) => {
    if (!userStates[userId]) {
        userStates[userId] = {};
    }
    Object.assign(userStates[userId], newState);
};

module.exports = { setUserState, getUserState, updateUserState };