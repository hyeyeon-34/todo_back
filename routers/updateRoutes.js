const router = require('express').Router();

const {
  updateCompletedTask,
  updateTask,
} = require('../controllers/updateTask');

router.patch('/update_completed_task', updateCompletedTask); // 컨트롤러 함수 연결 , : 은 정해지지 않은 문자열 표시
// patch는 변경 사항에 대한 부분만 업데이트 한다.
// pu은 전체를 업데이트한다.

router.put('/update_task', updateTask);
module.exports = router;
