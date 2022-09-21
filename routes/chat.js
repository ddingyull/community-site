const express = require('express');
const router = express.Router();
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 3000 });

// 연습
// // 연결이 되면 ws를 통해 서버를 연결시켰을 때
// wss.on('connection', (ws) => {
//   ws.send('저는 서버입니다! 들리십니까?');
//   // 서버가 메세지를 받을 때
//   ws.on('message', (message) => {
//     console.log(message.toString());
//   });
// });

wss.on('connection', (ws) => {
  wss.clients.forEach((client) => {
    client.send(
      `새로운 유저가 참가 했습니다. 현재 유저 수는 ${wss.clients.size}`
    );
  });

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      // client.send(message.toString());
      client.send(`${message}`);
    });
  });

  ws.on('close', () => {
    wss.clients.forEach((client) => {
      client.send(
        `유저 1명이 퇴장하였습니다. 현재 유저 수는 ${wss.clients.size}`
      );
    });
  });
});

router.get('/', (req, res) => {
  res.render('chat.ejs');
});

module.exports = router;
