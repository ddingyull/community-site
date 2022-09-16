//@ts-check

const express = require('express');
const mongoClient = require('./mongodb');

const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('login.ejs');
});

// 로그인
router.post('/', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      // 만약에 로그인에 문제가 생겼을 때
      return res.send(
        `${info.message}<br><a href="/login">로그인 페이지로 이동</a>` // 전략세웠던 함수의 info내용이 전달
      );
    }
    req.logIn(user, (err) => {
      // login 메서드를 사용해서 user를 가져옴
      if (err) next(err);
      res.redirect('/board');
    });
  })(req, res, next);
});

// 로그아웃
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
  });
  return res.redirect('/');
});

module.exports = router;
