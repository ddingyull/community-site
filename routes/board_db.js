//@ts-check;

const express = require('express');

const router = express.Router();

const mongoClient = require('./mongodb');
const login = require('./login');

// function isLogin(req, res, next) {
//   if (req.session.login || req.user || req.signedCookies.user) {
//     next();
//   } else {
//     res.status(300);
//     res.send(
//       '로그인 필요한 서비스 입니다.<br><a href="/login">로그인하러 가기</a>'
//     );
//   }
// }

const { MongoClient } = require('mongodb');
const { resourceLimits } = require('worker_threads');
const { futimesSync, read } = require('fs');
const uri =
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority';

// 글 전체 목록 보여주기 (콜백함수로 작성된 코드)
// 보여주기 ://localhost:4000/board/ 주소라고 생각해야함 (파일이 한개 더 들어왔기 때문)
router.get('/', login.isLogin, async (req, res) => {
  console.log(req.user);
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  const BOARD = await cursor.find({}).toArray();
  const boardLen = BOARD.length;
  res.render('board', {
    BOARD,
    boardCounters: boardLen,
    userId: req.session.userId
      ? req.session.userId
      : req.user?.id
      ? req.user.id
      : req.signedCookies.user,
  });
});

// 글쓰기 모드로 이동
router.get('/write', login.isLogin, (req, res) => {
  res.render('write.ejs');
});

// 글 추가 기능 수행
router.post('/write', login.isLogin, async (req, res) => {
  console.log(req.body);
  if (req.body.title && req.body.user) {
    const newBoard = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      // user: req.body.user,
    };
    const client = await mongoClient.connect();
    const cursor = client.db('node1').collection('board');
    await cursor.insertOne(newBoard);
    res.redirect('/board');
  }
});

// 글 수정 모드로 이동
router.get('/modify/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  const selectedBoard = await cursor.findOne({ title: req.params.title });
  console.log(selectedBoard);
  res.render('board_modify', { selectedBoard });
});

// 글 수정
router.post('/modify/title/:title', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.user && req.body.day) {
    const client = await mongoClient.connect();
    const cursor = client.db('node1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      {
        $set: { title: req.body.title, user: req.body.user, day: req.body.day },
      }
    );
    res.redirect('/board');
  }
});

// 글 삭제
router.delete('/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

// function deleteBoard(title) {
//   fetch(`board/delete/title/${title}`, {
//     method: 'delete',
//     headers: {
//       'Content-type': 'application/json',
//     },
//   }).then((res) => {
//     location.href = '/board';
//   });
// }

module.exports = router;
