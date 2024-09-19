const router = require('express').Router();
const { postTasks } = require('../controllers/postTasks');

router.post('/post_tasks', postTasks); // 컨트롤러 함수 연결 , : 은 정해지지 않은 문자열 표시

module.exports = router;
