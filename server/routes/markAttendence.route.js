const router = require("express").Router();
const actions = require("../controllers/markAttendence.controller");
router.route("/").patch(actions.setActive);
router.route("/create-attendence").post(actions.markAttendenceasync);
router.route("/student-attendence/:cid/:sid").get(actions.getStudentAttendance);
router.route("/get-all-attendence").get(actions.getClassStudentAttendences);
router
  .route("/delete-attendence-by-id")
  .delete(actions.deleteStudentAttendenceById);
router
  .route("/delete-attendencerecord-by-id")
  .delete(actions.deleteStudentAttendenceRecordById);
router
  .route("/delete-attendencerecord-by-date")
  .delete(actions.deleteStudentAttendenceRecordByDate);

module.exports = router;
