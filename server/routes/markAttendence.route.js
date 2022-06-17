const router = require("express").Router();
const actions = require("../controllers/markAttendence.controller");
router.route("/").patch(actions.setActive);
router.route("/create-attendence").post(actions.markAttendenceasync);
router.route("/student-attendence/:cid/:sid").get(actions.getStudentAttendance);
router.route("/get-all-attendence").get(actions.getClassStudentAttendences);
module.exports = router;
