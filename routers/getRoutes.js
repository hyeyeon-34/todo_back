const router = require('express').Router(); // express 모듈에 있는 Router라는 메사드 가져오기 api path를 전달해 주는 메서드

const { getTasks } = require('../controllers/getTasks');

router.get('/get_tasks/:userId', getTasks); // 컨트롤러 함수 연결 , : 은 정해지지 않은 문자열 표시

module.exports = router;
