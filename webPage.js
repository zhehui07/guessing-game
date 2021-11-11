const webPage = {
    loginPage: function(shouldShowInvalidMsg, isSIdValid){
        return `
        <!doctype html>
        <html>
          <head>
            <title>Chat</title>
            <link rel="stylesheet" href="game.css">
          </head>
          <body>
            <h1>Come And Guess! </h1>
            ${!isSIdValid ? `<p>You sessionId is invlid. </p>`: ``}
            ${shouldShowInvalidMsg ? `<p>You input user name is invalid! Please try another one. </p>`: ``}
            <form action="/login" method="post">
              <div>
                <label for="username"> User Name : </input>
                <input type="text" name="username" required></input>
              </div>
              <input class="button" type="submit" value="Submit">
            </form>
          </body>
        </html>
    `;
    },
    gamePage:function(words, userInfo){
      return `
        <!doctype html>
        <html>
          <head>
            <title>Chat</title>
            <link rel="stylesheet" href="game.css">
          </head>
          <body>
          <div>
            <div class="wordList">
              <label> Words List :</label></br>
              ${webPage.getWordList(words)}

            </div class="gameStatus">
            ${webPage.getGameHistory(userInfo)}
            ${webPage.getLastGuess(userInfo)}
            ${webPage.makeAGuess(userInfo)}
            <form action="/new-game" method="post">
              <button class="makeNewGameBtn"> Make a new game </button>
            </form>
          </div>
          ${webPage.logoutForm()}
          </body>
        </html>
    `;  
    },
    logoutForm: function () {
      return `
        <form action="/logout" method="post">
          <button class="logoutBtn"> Logout </button>
        </form>
      `;
    },
    getWordList: function(words) {
      return `<textarea class="words" rows="8" cols="50" disabled>` +
      Object.values(words).map( (word) => `${word}`).join(', ') +
        `</textarea>`;
    },

    getLastGuess: function(userInfo) {
      if (userInfo.history.length
        && userInfo.history[userInfo.history.length - 1].matched === -1) {
        return `<p> You last guess ${userInfo.history[userInfo.history.length - 1].guess} was invalid!</p>`;
      }
      return ``;
    },

    makeAGuess: function(userInfo) {
      if (userInfo.history.length
        && userInfo.history[userInfo.history.length - 1].matched === userInfo.word.length) {
        return `<p> You have won!!!</p>`;
      } else {
        return `
          <form action="/guess" method="post">
            <div>
              <label> Make a Guess </input>
              <input type="text" name="guessWord" required></input>
              <input class="button" type="submit" value="Try">
            </div>
          </form>
        `;
      }
    },

    getGameHistory: function(userInfo) {
      const validCount = Object.values(userInfo.history).filter((history) => history.matched != -1).length;
      return `
      <table>
        <tr>
          <th>Your Guess</th>
          <th>Matched</th>
        </tr>` +
        Object.values(userInfo.history)
        .map( (history) => 
          history.matched === -1 ? `` : `
            <tr>
              <td> ${history.guess} </td>
              <td> ${history.matched} </td>
            </tr>
        `).join('') +
      `</table>` + 
      `<p class= "score"> You have made ${validCount} total valid guesses so far </p>`;
    },
}
module.exports = webPage;