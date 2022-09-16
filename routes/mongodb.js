const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;

// async function main() {
//   const db = await client.connect();
//   // console.log(db);

//   const users = client.db('node1').collection('users');
//   await users.deleteOne({
//     name: 'kking',
//   });
//   await users.deleteMany({
//     age: { $gte: 5 },
//   });
//   await users.insertOne({
//     name: 'dding',
//     age: 10,
//   });
//   await users.insertMany([
//     {
//       name: 'dding',
//       age: 5,
//     },
//     {
//       name: 'kking',
//       age: 10,
//     },
//   ]);

//   await users.updateMany(
//     {
//       age: { $gte: 7 }, //5살 이상인 경우
//     },
//     {
//       $set: {
//         name: '형아들',
//         hobby: '수영',
//       },
//     }
//   );

//   // const arr = await users.findOne({
//   //   name: 'dding',
//   // });
//   const data = users.find({
//     name: 'dding',
//   });
//   console.log(data);
//   // const data = users.find({}); //원래였으면 awiat를 넣어주지만, mongodb특성상 data라고 따로 선언해서 불러오기
//   const arr = await data.toArray(); //데이터 각각에 접근해서 출력할 때 awiat를!
//   // console.log(data);
//   console.log(arr);
//   await client.close();
// }

// main();
