//@ts-check;

const express = require('express');

const router = express.Router();

const POST = [
  {
    title: 'title1',
    content: 'content1',
  },
  {
    title: 'title2',
    content: 'content2',
  },
  {
    title: 'title3',
    content: 'content3',
  },
];

// 보여주기
router.get('/', (req, res) => {
  const POSTLen = POST.length;
  res.render('posts.ejs', { POST, postCounters: POSTLen });
});

// 타이틀 보여주기
router.get('/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    res.send(postData);
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
  }
});

// 게시물 등록하기
router.post('/', (req, res) => {
  //req.body에서 object가 가지고 있는 key값들을 배열로 반환([id, name, email])하는데 1개 이상일 경우
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.text) {
      const newPost = {
        title: req.query.title,
        text: req.query.text,
      };
      POST.push(newPost);
      // res.send('회원 등록 완료');
      res.redirect('/posts');
    } else {
      const err = new Error('Unexpected Form data');
      err.statusCode = 404;
      throw err;
      // res.end('잘못된 쿼리 입니다.');
    }
  } else if (req.body) {
    if (req.body.title && req.body.text) {
      const newPost = {
        title: req.body.title,
        text: req.body.text,
      };
      POST.push(newPost);
      // res.send('회원 등록 완료');
      res.redirect('/posts');
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

// 게시글 수정하기
router.put('/:title', (req, res) => {
  if (req.query.title && req.query.content) {
    const postData = POST.find((post) => post.title === req.params.title);
    if (postData) {
      const arrIndex = POST.findIndex(
        (post) => post.title === req.params.title
      );
      const modifyPost = {
        title: req.query.title,
        content: req.query.content,
      };
      POST[arrIndex] = modifyPost;
      // res.send('게시글 수정 완료');
      res.redirect('/posts');
    } else {
      const err = new Error('Not found');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query');
    err.statusCode = 404;
    throw err;
  }
});

// 게시글 삭제하기
router.delete('/:title', (req, res) => {
  const arrIndex = POST.findIndex((post) => post.title === req.params.title);
  if (arrIndex !== -1) {
    POST.splice(arrIndex, 1);
    // res.send('회원 삭제 완료');
    res.redirect('/posts');
  } else {
    const err = new Error('Not found');
    err.statusCode = 404;
    throw err;
  }
});
module.exports = router;
