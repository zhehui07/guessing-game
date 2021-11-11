const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const {v4: uuidv4} = require('uuid');
const game = require('./game');
const webPage = require('./webPage');
const { userInfo } = require('./game');

app.use(express.static('./public'));
app.use(cookieParser());

app.get('/', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if(!sessionId || !game.lookForSessionId(sessionId)){
      res.redirect('./login');
  }else{
      const user = game.lookForUserInfoBySessionId(sessionId);
      res.send(webPage.gamePage(game.words, user));
  }
});

app.get('/login', (req,res) => {
    const sessionId = req.cookies.sessionId;
    if(!sessionId){
      res.clearCookie('sessionId');
      game.removeSessionId(sessionId);
      res.send(webPage.loginPage(false, true));
    } else if(!game.lookForSessionId(sessionId)){
      res.clearCookie('sessionId');
      game.removeSessionId(sessionId);
      res.send(webPage.loginPage(false, false));
    } else{
        res.redirect('/');
    }
});

app.post('/login', express.urlencoded({ extended: false }), (req, res) =>{
  const uname = req.body.username;
  if (!game.validateUserName(uname)) {
    res.send(webPage.loginPage(true, true));
  } else {
    const sessionId = uuidv4();
    res.cookie('sessionId', sessionId);
    if (game.updateUserInfo(sessionId, uname)) {
      res.redirect('/new-game');
    } else {
      res.redirect('/');
    }
  }
});

app.post('/logout', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    game.removeSessionId(sessionId);
  }
  res.clearCookie('sessionId');
  res.redirect('./login');
});

app.get('/logout', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    game.removeSessionId(sessionId);
  }
  res.clearCookie('sessionId');
  res.redirect('./login');
});

app.get('/new-game', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !game.lookForSessionId(sessionId)) {
    res.redirect('./login');
  } else {
    const user = game.lookForUserInfoBySessionId(sessionId);
    game.newGame(user);
    res.redirect('/');
  }
});

app.post('/new-game', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !game.lookForSessionId(sessionId)) {
    res.redirect('./login');
  } else {
    const user = game.lookForUserInfoBySessionId(sessionId);
    game.newGame(user);
    res.redirect('/');
  }
});

app.post('/guess', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !game.lookForSessionId(sessionId)) {
    res.redirect('./login');
  } else {
    const guessWord = req.body.guessWord;
    const user = game.lookForUserInfoBySessionId(sessionId);
    game.compare(user, guessWord);
    res.redirect('/');
  }
});


app.get('/guess', express.urlencoded({ extended: false }), (req, res) =>{
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !game.lookForSessionId(sessionId)) {
    res.redirect('./login');
  } else {
    const guessWord = req.body.guessWord;
    const user = game.lookForUserInfoBySessionId(sessionId);
    game.compare(user, guessWord);
    res.redirect('/');
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));