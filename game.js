const words = require('./words');
const sessionInfo = {};

const userInfo = {
    zhehui: {
        word: "LARGE",
        history: [
            {
                guess: "SPACE",
                matched: 2
            },
            {
                guess: "TRACK",
                matched: 3
            }
        ]
    }
};
function validateUserName(uname) {
    if (uname != 'dog') {
      const pattern =  /^[a-zA-Z0-9]*$/;
      if (pattern.test(uname)) {
        return true;
      }
    }
    return false;
}

function lookForUserInfoBySessionId(sessionId) {
    if (sessionInfo[sessionId]) {
        return userInfo[sessionInfo[sessionId]];
    }
    return null;
}

function removeSessionId(sessionId) {
    delete sessionInfo[sessionId];
}
  
function lookForSessionId(sessionId) {
    if (sessionInfo[sessionId]) {
      return true;
    }
    return false;
}

function updateUserInfo(sessionId, uname) {
    sessionInfo[sessionId] = uname;
    if (userInfo[uname] == null) {
        userInfo[uname] = {};
        return true;
    }
    return false;
}

function isGuessValid(guess) {
    for (let idx in words) {
        let word = words[idx];
        if (guess.toUpperCase() == word.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function compare(user, guess) {
    let word = user.word.toUpperCase();
    let count = word.length;
    if (isGuessValid(guess)) {
        guess = guess.toUpperCase();
        for (let i = 0; i < guess.length; i++) {
            word = word.replace(guess[i], "");
        }
        count -= word.length;
    } else {
        count = -1;
    }
    user.history.push({guess: guess, matched: count});
    return count;
}

function newGame(user) {
    const word = words[Math.floor(Math.random() * words.length)];
    user.word = word;
    console.log(`The word to be guessed is ${word}`);
    user.history = [];
}

const game = {
    words,
    sessionInfo,
    userInfo,
    lookForSessionId,
    validateUserName,
    lookForUserInfoBySessionId,
    updateUserInfo,
    removeSessionId,
    compare,
    newGame
}
module.exports = game;