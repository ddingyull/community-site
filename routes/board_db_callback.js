//@ts-check;

const express = require('express');

const router = express.Router();

const mongoClient = require('./mongodb.js');

const { MongoClient, ServerApiversion } = require('mongodb');
const uri =
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority';

// 글 전체 목록 보여주기 (콜백함수로 작성된 코드)
// 보여주기 ://localhost:4000/board/ 주소라고 생각해야함 (파일이 한개 더 들어왔기 때문)
router.get('/', async (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('node1').collection('board');

    data.find({}).toArray((err, result) => {
      const BOARD = result;
      const boardLen = BOARD.length;
      res.render('boards.ejs', { BOARD, boardCounters: boardLen });
    });
  });
});

//글 전체 목록 보여주기 리팩토링 해보기
router.get('/', async (req, res) => {
  const client = await mongoClient.connect(); //데이터를 변화할 때 async,await하면 됨
  const cursor = client.db('node1').collection('board');
  const BOARD = await cursor.find({}).toArray();
  const boardLen = BOARD.length;
  res.render('board', { BOARD, boardCounters: boardLen });
});

// 글쓰기 모드로 이동
router.get('/write', (req, res) => {
  res.render('write.ejs');
});

// 글 추가 기능 수행
router.post('/write', (req, res) => {
  if (req.body.title && req.body.user && req.body.day) {
    const newBoard = {
      title: req.body.title,
      user: req.body.user,
      day: req.body.day,
    };
    MongoClient.connect(uri, (err, db) => {
      const data = db.db('node1').collection('board');
      data.insertOne(newBoard, (err, result) => {
        // if (err) {throw err;} else {
        res.redirect('/board');
        // }
      });
    });
  } else {
    const err = new Error('Unexpected Form data');
    err.statusCode = 404;
    throw err;
  }
});

// 글 수정 모드로 이동
router.get('/modify/title/:title', (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('node1').collection('board');
    data.findOne({ title: req.params.title }, (err, reult) => {
      if (err) {
        throw err;
      } else {
        const selectedBoard = reult;
        res.render('board_modify.ejs', { selectedBoard });
      }
    });
  });
});

// 글 수정
router.post(
  '/modify/title/:title',
  (req, res) => {
    if (req.body.title && req.body.user && req.body.day) {
      MongoClient.connect(uri, (err, db) => {
        const data = db.db('node1').collection('board');
        data.updateOne(
          { title: req.params.title },
          {
            $set: {
              title: req.body.title,
              user: req.body.user,
              day: req.body.day,
            },
          },
          (err, result) => {
            if (err) {
              throw err;
            } else {
              res.redirect('/board');
            }
          }
        );
      });
    }
  }
  //  else {
  //   const err = new Error('요청 값이 없습니다.');
  //   err.statusCode = 404;
  //   throw err;
  // }}
);

// 글 삭제
router.delete('/title/:title', (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('node1').collection('board');

    data.deleteOne({ title: req.params.title }, (err, reult) => {
      if (err) {
        throw err;
      } else {
        res.send('삭제완료');
      }
    });
  });
});

function deleteBoard(title) {
  fetch(`board/delete/title/${title}`, {
    method: 'delete',
    headers: {
      'Content-type': 'application/json',
    },
  }).then((res) => {
    location.href = '/board';
  });
}

module.exports = router;
