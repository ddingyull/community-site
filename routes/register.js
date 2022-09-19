//@ts-check

const express = require('express');

const router = express.Router();
const mongoClient = require('./mongodb');

router.get('/', (req, res) => {
  res.render('register.ejs');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('node1').collection('users');
  const duplicated = await userCursor.findOne({ id: req.body.id });

  if (duplicated === null) {
    const result = await userCursor.insertOne({
      name: req.body.id,
      id: req.body.id,
      password: req.body.password,
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

module.exports = router;
