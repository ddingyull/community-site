const express = require('express');

const router = express.Router();

const LIST = [
  {
    제목: '신규 React 수업 개강',
    글쓴이: '강유림',
    작성일: '9월 1일',
  },
  {
    title: '괴짜문화예술기획자 양성과정 크루 모집',
    글쓴이: '임채은',
    작성일: '9월 2일',
  },
  {
    title: '기숙사 사생을 위한 생수 특별행사',
    글쓴이: '김병훈',
    작성일: '9월 3일',
  },
];

module.exports = router;
