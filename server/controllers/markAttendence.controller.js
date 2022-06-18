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
      });
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

exports.getClassStudentAttendences = async (req, res, next) => {
  try {
    const { role } = req.User;
    console.log(req.User, "user..........");
    let allClasses = null;
    let params = {};
    if (validateUser.checkAdmin(role)) {
      params = {
        id: parseInt(req.query.cid),
      }
    }
    else if (validateUser.checkTeacher(role)) {
      params = {
        id: parseInt(req.query.cid),
        teacherId: req.User.id
      }
    }
    else {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    allClasses = await prisma.class.findUnique({
      where: params,
      select: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            RollNo: true,
          },
        },
      },
    });
    const studentIds = allClasses.students.map((stu) => stu.RollNo);
    const attendences = await prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
      },
      select: {
        id: true,
        createdAt: true,
        isPresent: true,
        studentId: true,
      },
    });
    const students = [];
    allClasses.students.forEach((student, index) => {
      students.push({ ...student, studentAttendance: [] });
      attendences.forEach((attendence, index2) => {
        if (attendence.studentId == student.RollNo) {
          students[index].studentAttendance.push(JSON.stringify(attendence));
        }
      });
    });
    allClasses.students = students;
    res.status(200).json({
      success: true,
      classes: allClasses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.deleteStudentAttendenceById = async (req, res, next) => {
  try {
    const { role } = req.User;
    if (!validateUser.checkAdmin(role)) {
      next(new ErrorResponse("Unauthorized route", 401));
    }

    const deletedAttendence = await prisma.attendance.delete({
      where: { id: parseInt(req.query.id) },
    });

    console.log(req.query, "query......");
    res.status(200).json({
      success: true,
      attendance: deletedAttendence,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.deleteStudentAttendenceRecordById = async (req, res, next) => {
  try {
    const { role } = req.User;
    if (!validateUser.checkAdmin(role)) {
      next(new ErrorResponse("Unauthorized route", 401));
    }

    const deletedAttendence = prisma.attendance.deleteMany({
      where: { attendanceRecordId: parseInt(req.query.id) },
    });
    const deletedRecord = prisma.attendanceRecord.delete({
      where: { id: parseInt(req.query.id) },
    });
    const transaction = await prisma.$transaction([
      deletedAttendence,
      deletedRecord,
    ]);

    res.status(200).json({
      success: true,
      attendance: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.deleteStudentAttendenceRecordByDate = async (req, res, next) => {
  try {
    const { role } = req.User;
    if (!validateUser.checkAdmin(role)) {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    const deleteRecord = await prisma.attendanceRecord.findMany({
      where: {
        createdAt: {
          equals: req.query.date,
        },
      },
      select: {
        id: true,
      },
    });
    const record = deleteRecord.map((val) => val.id);
    const deletedRecord = await prisma.attendance.deleteMany({
      where: {
        attendanceRecordId: { in: record },
      },
    });

    const deletedR = await prisma.attendanceRecord.deleteMany({
      where: {
        id: { in: record },
      },
    });

    res.status(200).json({
      success: true,
      attendance: record,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }

}

exports.updateStudentAttendenceById = async (req, res, next) => {
  try {
    const { role } = req.User;
    const{id,isPresent} = req.body;
    if (!validateUser.checkAdmin(role)) {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    const updatedAttendence = await prisma.attendance.update({
      where: {
         id: parseInt(id) 
        },
      data: {
        isPresent: isPresent == 'true' ? true : false
      }  
    })

    res.status(200).json({
      success: true,
      attendance: updatedAttendence,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
}

exports.updateStudentAttendencRecordById = async (req, res, next) => {
  try {
    const { role } = req.User;
    const{attendanceRecordId,attendances} = req.body;
    if (!validateUser.checkAdmin(role)) {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    const presents = attendances.map(att => {
      if (att.isPresent == 'true')
          return att.studentId
      else
          return ''
    })
    const absents = attendances.map(att => {
      if (att.isPresent == 'false')
          return att.studentId
      else
          return ''    
    })
    const presentAttendence =  prisma.attendance.updateMany({
      where: {
          attendanceRecordId: parseInt(attendanceRecordId),
          studentId: { in: presents },
        },
      data: {
        isPresent: true
      }
    });
    const absentAttendence =  prisma.attendance.updateMany({
      where: {
          attendanceRecordId: parseInt(attendanceRecordId),
          studentId: { in: absents },
        },
      data: {
        isPresent: false
      }
    });
    const transaction = await prisma.$transaction([
      presentAttendence,
      absentAttendence,
    ]);

    res.status(200).json({
      success: true,
      attendance: transaction,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
}
