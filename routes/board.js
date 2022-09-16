// //@ts-check;

// const express = require('express');

// const router = express.Router();

// const { MongoClient, ServerApiversion } = require('mongodb');

// const BOARD = [
//   {
//     title: '신규 React 수업 개강',
//     user: '강유림',
//     day: '9월 1일',
//   },
//   {
//     title: '괴짜문화예술기획자 양성과정 크루 모집',
//     user: '임채은',
//     day: '9월 2일',
//   },
//   {
//     title: '기숙사 사생을 위한 생수 특별행사',
//     user: '김병훈',
//     day: '9월 3일',
//   },
// ];

// // 글 전체 목록 보여주기
// // 보여주기 ://localhost:4000/board/ 주소라고 생각해야함 (파일이 한개 더 들어왔기 때문)
// router.get('/', (req, res) => {
//   const boardLen = BOARD.length;
//   res.render('boards.ejs', { BOARD, boardCounters: boardLen });
// });

// // 글쓰기 모드로 이동
// router.get('/write', (req, res) => {
//   res.render('write.ejs');
// });

// // 글 추가 기능 수행
// router.post('/write', (req, res) => {
//   if (req.body.title && req.body.user && req.body.day) {
//     const newBoard = {
//       title: req.body.title,
//       user: req.body.user,
//       day: req.body.day,
//     };
//     BOARD.push(newBoard);
//     res.redirect('/board'); //get으로 돌아가는 구조
//   } else {
//     const err = new Error('Unexpected Form data');
//     err.statusCode = 404;
//     throw err;
//   }
// });

// // 글 수정 모드로 이동
// router.get('/modify/title/:title', (req, res) => {
//   // 수정하고자하는 글의 index값 알아내기
//   const arrIndex = BOARD.findIndex((board) => board.title === req.params.title);
//   // 배열에서 수정하고자하는 정보를 변수에 담은 후 res.render해서 수정모드로 보여주기
//   const selectedBoard = BOARD[arrIndex];
//   console.log(selectedBoard);
//   res.render('board_modify.ejs', { selectedBoard });
// });

// // 글 수정
// router.post('/modify/title/:title', (req, res) => {
//   if (req.body.title && req.body.user && req.body.day) {
//     const arrIndex = BOARD.findIndex(
//       (board) => board.title === req.params.title
//     );
//     BOARD[arrIndex].title = req.body.title;
//     BOARD[arrIndex].user = req.body.user;
//     BOARD[arrIndex].day = req.body.day;
//     res.redirect('/board');
//   } else {
//     const err = new Error('요청 값이 없습니다.');
//     err.statusCode = 404;
//     throw err;
//   }
// });

// // 글 삭제
// router.delete('/title/:title', (req, res) => {
//   if (req.body.title && req.body.user && req.body.day) {
//     const arrIndex = BOARD.findIndex(
//       (board) => board.title === req.params.title
//     );
//     if (arrIndex !== -1) {
//       BOARD.splice(arrIndex, 1);
//       res.send('삭제완료');
//     } else {
//       const err = new Error('삭제되지 않았습니다.');
//       err.statusCode = 404;
//       throw err;
//     }
//   }
// });

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

// module.exports = router;
