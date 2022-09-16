//@ts-check

const express = require('express');
const mongoClient = require('./mongodb');

const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('login.ejs');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('node1').collection('users');
  const idResult = await userCursor.findOne({ id: req.body.id });

  if (idResult !== null) {
    if (idResult.password === req.body.password) {
      req.session.login = true;
      req.session.userId = req.body.id;
      res.redirect('/board');
    } else {
      res.status(300);
      res.send('비밀번호가 틀렸습니다<br><a href="/login">로그인하러 가기</a>');
    }
  } else {
    res.status(300);
    res.send('비밀번호가 틀렸습니다<br><a href="/login">로그인하러 가기</a>');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
