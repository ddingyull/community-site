//@ts-check

const express = require('express');
// const mongoClient = require('./mongodb');

const router = express.Router();
const passport = require('passport');

const isLogin = (req, res, next) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    next();
  } else {
    res.status(300);
    res.send(
      '로그인 필요한 서비스 입니다.<br><a href="/login">로그인하러 가기</a><br/><a href="/login">메인 페이지로 이동</a>'
    );
  }
};

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
      res.cookie('user', req.body.id, {
        expires: new Date(Date.now() + 1000 * 60),
        httpOnly: true,
        signed: true,
      });
      res.redirect('/board');
    });
  })(req, res, next);
});

// 로그아웃
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('/');
  });
  return res.redirect('/');
});

router.get('/auth/naver', passport.authenticate('naver'));
router.get(
  '/auth/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

module.exports = { router, isLogin };
