const router = require('express').Router();
const actions = require('../controllers/student.controller');

router.route('/').get(actions.ViewStudents).post(actions.AddStudent).patch(actions.EditStudent);

router.route("/get-student-attendence").get(actions.getStudentAttendence);

// router.route('/:id').delete(actions);
module.exports = router;