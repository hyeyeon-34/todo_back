// const { Pool } = require('pg'); // postgres 모듈 불러오기
// require('dotenv').config(); // .env 파일 사용 설정

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
// });
// //  .env에서 생성한 환경변수에는 내 정보가 들어가있기 때문에 각각의 변수로 다시 이 env들을 담는다.

// module.exports = pool;
// // {}로 감쌀 경우 pool 변수를 적어서 사용해야 한다.

// db/index.js
const { Pool } = require('pg'); // postgres 모듈 불러오기
require('dotenv').config(); // .env 파일 사용 설정

// PostgreSQL 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST,    // 데이터베이스 호스트
  user: process.env.DB_USER,    // 사용자
  password: process.env.DB_PASS, // 비밀번호
  port: process.env.DB_PORT,     // 포트
  database: process.env.DB_NAME, // 데이터베이스 이름
});

// 쿼리 실행 함수 내보내기
module.exports = {
  query: (text, params) => pool.query(text, params),
};
