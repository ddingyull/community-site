// @ts-check

const express = require('express');

const router = express.Router();

const USER = [
  {
    id: 'dding',
    name: 'yuirm',
    email: 'dding.yull@naver.com',
  },
  {
    id: 'kang',
    name: 'yururu',
    email: 'test@gamil.com',
  },
];

router.get('/', (req, res) => {
  const userLen = USER.length;
  res.render('users', { USER, userCounts: userLen });
  // res.send(USER);
  // res.write('<h1>Hello, Dynamic Web page</h1>');
  // for (let i = 0; i < USER.length; i++) {
  //   res.write(`<h2>USER ID는 ${USER[i].id} </h2>`);
  //   res.write(`<h2>USER NAME는 ${USER[i].name} </h2>`);
  // }
});

router.get('/:id', (req, res) => {
  const userData = USER.find((user) => user.id === req.params.id);
  if (userData) {
    res.send(userData);
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
    // res.end('ID not found');
  }
});

router.post('/', (req, res) => {
  //req.body에서 object가 가지고 있는 key값들을 배열로 반환([id, name, email])하는데 1개 이상일 경우
  if (Object.keys(req.query).length >= 1) {
    if (req.query.id && req.query.name && req.query.email) {
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER.push(newUser);
      res.send('회원 등록 완료');
    } else {
      const err = new Error('Unexpected Form data');
      err.statusCode = 404;
      throw err;
      // res.end('잘못된 쿼리 입니다.');
    }
  } else if (req.body) {
    if (req.body.id && req.body.name && req.body.email) {
      const newUser = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
      };
      USER.push(newUser);
      // res.send('회원 등록 완료');
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected Form data');
      err.statusCode = 404;
      throw err;
      // res.end('잘못된 쿼리 입니다.');
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

// 실습 내가 짠 코드
// router.put('/:id', (req, res) => {
//   const arrIndex = USER.findIndex((user) => user.id === req.params.id);
//   if (USER[arrIndex].id) {
//     USER[arrIndex] = {
//       id: req.query.id,
//       name: req.query.name,
//     };
//     res.send('회원 수정 완료');
//   } else {
//     res.end('잘못된 쿼리 입니다.');
//   }
// });

router.put('/:id', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const userData = USER.find((user) => user.id === req.params.id);
    if (userData) {
      const arrIndex = USER.findIndex((user) => user.id === req.params.id);
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER[arrIndex] = modifyUser;
      // res.send('회원 수정 완료');
      res.redirect('/users');
    } else {
      // res.end('해당 ID를 가진 회원이 없습니다.');
      const err = new Error('ID not found');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query');
    err.statusCode = 404;
    throw err;
    // res.end('부적절한 쿼리 입니다.');
  }
});

// 실습 내가 짠 코드
// router.delete('/:id', (req, res) => {
//   const arrIndex = USER.findIndex((user) => user.id === req.params.id);
//   if (req.params.id === USER[arrIndex].id) {
//     delete USER[arrIndex];
//     res.send('회원 삭제');
//   } else {
//     res.end('잘못된 쿼리 입니다.');
//   }
// });

router.delete('/:id', (req, res) => {
  console.log(req.params);
  const arrIndex = USER.findIndex((user) => user.id === req.params.id);
  if (arrIndex !== -1) {
    USER.splice(arrIndex, 1);
    // res.send('회원 삭제 완료');
    console.log('@');
    res.send('회원가입완료');
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
    // res.end('해당 ID를 가진 회원이 없습니다.');
  }
});

module.exports = router;
