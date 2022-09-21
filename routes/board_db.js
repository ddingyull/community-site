//@ts-check;

const express = require('express');
const multer = require('multer');
const fs = require('fs'); // 요청한 파일이 없으면 알아서 생성되도록하는!

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

const dir = './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir); //cb없으면 null이고 있으면 dir에 저장
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()); //file의 원래 파일명을 fieldname_날짜로 올 것(파일명 겹치지않게)
  },
});

const limits = {
  fileSize: 1024 * 1024 * 2, // 2메가용량으로 제한
};

const upload = multer({ storage, limits });

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
router.post('/write', login.isLogin, upload.single('img'), async (req, res) => {
  // 이미지 업로드할 파일이 있는지 확인하는 조건문
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); //async, await가 자동으로 이미 들어있는 코드
  console.log(req.file);
  // 작성한 내용 post되게하는 조건문
  if (req.body.title && req.body.user) {
    const newBoard = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      img: req.file ? req.file.filename : null,
      // user: req.body.user,
    };
    const client = await mongoClient.connect();
    const cursor = client.db('node1').collection('board');
    await cursor.insertOne(newBoard);
    res.redirect('/board');
  } else {
    const err = new Error('데이터가 없습니다');
    err.statusCode = 404;
    throw err;
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
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

// 글 삭제
router.delete('/delete/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
