const { profile, log } = require('console');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

const verifyModule = require('./register').verifyPassword;
const mongoClient = require('./mongodb');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('node1').collection('users');
        const idResult = await userCursor.findOne({ id }); // id:id와 같은의미
        if (idResult !== null) {
          // salt가 있다면 암호화된 비밀번호이다
          if (idResult.salt !== undefined) {
            const passwordResult = verifyModule(
              password,
              idResult.salt,
              idResult.password
            );
            if (passwordResult) {
              cb(null, idResult);
            } else {
              cb(null, false, { message: '비밀번호가 틀렸습니다.' });
            }
          } else if (idResult.password === password) {
            cb(null, idResult);
          } else {
            cb(null, false, { message: '비밀번호가 틀렸습니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id가 없습니다.' });
        }
      }
    )
  );
};

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CB_URL,
      // clientID: 'BxgJfoLtBWeSNrJCusvc',
      // clientSecret: 'FYHXtPKorw',
      // callbackURL: 'http://localhost:4000/login/auth/naver/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('node1').collection('users');
      const idResult = await userCursor.findOne({ id: profile.id }); // id:id와 같은의미
      if (idResult !== null) {
        cb(null, idResult);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '회원 생성 에러' });
        }
      }
    }
  )
);

// google 로그인 전략
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CB_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('node1').collection('users');
      const idResult = await userCursor.findOne({ id: profile.id }); // id:id와 같은의미
      if (idResult !== null) {
        cb(null, idResult);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '회원 생성 에러' });
        }
      }
    }
  )
);

// kakao 로그인 전략
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT,
      callbackURL: process.env.KAKAO_CB_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('node1').collection('users');
      const idResult = await userCursor.findOne({ id: profile.id }); // id:id와 같은의미
      if (idResult !== null) {
        cb(null, idResult);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '회원 생성 에러' });
        }
      }
    }
  )
);

// 맞다면 user.id를 받아오고
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// 위의 user.id를 id로 받아와서 이동할 때마다 id가 있는지 확인해주는 역할
passport.deserializeUser(async (id, cb) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('node1').collection('users');
  const result = await userCursor.findOne({ id });
  if (result) cb(null, result);
});
