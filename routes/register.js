//@ts-check

const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const mongoClient = require('./mongodb');

// salt전역변수로 저장해서 계속 사용할 수 있도록 하기
// let salt;

// 비밀번호 암호화시키기
const createHashedPassword = (password) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64'); // 비밀번호, salt, 몇번 반복, 글자길이, 해시알고리즘
  return { hashedPassword, salt };
  // return crypto.createHash('sha512').update(password).digest('base64');
};

// 암호화된 비밀번호 검증하기
const verifyPassword = (password, salt, userPassword) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');

  if (hashed === userPassword) return true;
  return false;
};

router.get('/', (req, res) => {
  // const newPw = createHashedPassword('1234'); // 알아볼 수 없는 문자들로 해석됨
  // console.log(verifyPassword('1234', salt, userPw));
  res.render('register.ejs');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('node1').collection('users');
  const duplicated = await userCursor.findOne({ id: req.body.id });

  const passwordResult = createHashedPassword(req.body.password);

  if (duplicated === null) {
    const result = await userCursor.insertOne({
      name: req.body.id,
      id: req.body.id,
      // password: req.body.password,
      password: passwordResult.hashedPassword,
      salt: passwordResult.salt,
    });
    if (result.acknowledged) {
      res.status(200);
      res.send('회원 가입 성공<br><a href="/login">로그인하러 가기</a>');
    } else {
      res.status(500);
      res.send(
        '가입된 계정이 없습니다<br><a href="/register">회원가입하러 가기</a>'
      );
    }
  } else {
    res.status(300);
    res.send(
      '이미 가입된 계정입니다<br><a href="/register">회원가입하러 가기</a>'
    );
  }
});

module.exports = { router, verifyPassword };
