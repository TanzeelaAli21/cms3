const prisma = require("../getPrisma");
const validateUser = require("../utils/checkAuthorization");
const ErrorResponse = require("../utils/Error");
exports.setActive = async (req, res, next) => {
  try {
    const { id, active } = req.body;
    const { role } = req.User;
    if (!validateUser.checkAdmin(role))
      next(new ErrorResponse("Unauthorized route", 401));
    const update = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        active: active,
      },
    });
    res.status(201).json({
      success: true,
      message: "state updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.markAttendenceasync = async (req, res, next) => {
  try {
    const { role } = req.User;
    const classId = req.body.currentClass.id;
    const date = req.body.date;
    const students = req.body.currentClass.students;
    const presents = req.body.presents;
    var attendances = students.map((person) => ({
      studentId: person.RollNo,
      isPresent: presents.indexOf(person.RollNo) != -1 ? true : false,
    }));
    const studentIds = req.body.currentClass.studentIds;
    // next(new ErrorResponse("Unauthorized route", 401));
    if (!classId || !date)
      next(new ErrorResponse("Enter correct details", 400));

    if (req.body.doUpdate) {
      let ret = await prisma.attendance.updateMany({
        data: {
          isPresent: true,
        },
        where: {
          attendanceRecordId: req.body.selectedRecord,
          studentId: { in: presents },
        },
      });
      ret = await prisma.attendance.updateMany({
        data: {
          isPresent: false,
        },
        where: {
          attendanceRecordId: req.body.selectedRecord,
          NOT: {
            studentId: {
              in: presents,
            },
          },
        },
      });
    } else {

        const record = await prisma.attendanceRecord.create({
          data: {
            classId: parseInt(classId),
            createdAt: date,
            studentIds,
            attendances: {
              create: attendances,
            },
          },
        })
        console.log(record, "....record....");
        res.status(200).json({
          success: true,
          message: "attendance marked successfully",
        });
      // }

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    console.log("inside Atendance..............");
    const { role } = req.User;
    console.log(req.params);
    const studentId = req.params.sid;
    const studentAttendance = await prisma.attendance.findMany({
      where: {
        studentId: studentId,
      },
    });
    console.log("i am calling", studentAttendance);
    res.status(200).json({
      success: true,
      attendance: studentAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};
