//@ts-check

const express = require('express');

const router = express.Router();

// 프론트에서 보여주기
router.get('/', (req, res) => {
  // console.log(req.cookies.popup);
  res.render('index', { popup: req.cookies.popup });
});

// 백엔드에서 쿠키 보내주기
router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
  });
  res.send('쿠키 생성 성공');
});

// [프론트에서 쿠키 보내기]
// router.get('/', (req, res) => {
//   res.cookie('alert', true, {
//     // 현재 시간을 받아서 언제까지 팝업창을 남길 것인지
//     expires: new Date(Date.now() + 1000 * 10),
//     // http 브라우져에서 보여지도록 하겠다는 의미
//     httpOnly: true, //프론트에서 읽지 못하고 백에서 쿠키를 전달하기 위함
//   });
//   console.log(req.cookies.alert);
//   res.render('index.ejs', { alert: req.cookies.alert });
// });

module.exports = router;
