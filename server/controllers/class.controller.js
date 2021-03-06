const prisma = require("../getPrisma");
const validateUser = require("../utils/checkAuthorization");
const ErrorResponse = require("../utils/Error");

exports.createClass = async (req, res, next) => {
  try {
    const { role } = req.User;
    const { courseId, students, teacherId } = req.body;
    if (!validateUser.checkAdmin(role))
      next(new ErrorResponse("Unauthorized route", 401));
    if (!courseId || students.length === 0 || !teacherId)
      next(new ErrorResponse("Enter correct details", 400));
    console.log(req.body);
    const create = await prisma.class.create({
      data: {
        enrolled: true,
        courseId: courseId,
        teacherId: teacherId,
        studentIds: students,
        students: {
          connect: students.map((item) => ({ id: item })),
        },
      },
    });
    if (create)
      res.status(200).json({
        success: true,
        message: "class created successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};

exports.getAllClasses = async (req, res, next) => {
  try {
    console.log(req);
    const { role } = req.User;
    let allClasses = null;
    let param = {};
    if (validateUser.checkAdmin(role)) {
      param = {
        enrolled: true,
      }
    }
    else if (validateUser.checkTeacher(role)){
      param = {
        enrolled: true,
        teacherId: req.User.id
      }
    }
    else if (validateUser.checkStudent(role)){
      param = {
        enrolled: true,
        studentIds: {
          has: req.User.id
        }
      }
    }
    else {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    allClasses = await prisma.class.findMany({
      where: param,
      orderBy: {
        courseId: "asc",
      },
      include: {
        course: {
          select: {
            courseName: true,
            courseId: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },

        students: {
          select: {
            RollNo: true,
            name: true,
          },
        },
      },
    });
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


exports.getClassStudents = async (req, res, next) => {
  try {
    console.log("inside classes..............");
    const { role } = req.User;
    let params = {};
    if (validateUser.checkAdmin(role)) {
      params = {
        enrolled: true,
      }
    }
    else if (validateUser.checkTeacher(role)) {
      params = {
        enrolled: true,
        teacherId: req.User.id
      }
    }
    else {
      next(new ErrorResponse("Unauthorized route", 401));
    }
    const allClasses = await prisma.class.findMany({
      where: params,
      orderBy: {
        courseId: "asc",
      },
      include: {
        course: {
          select: {
            courseName: true,
            courseId: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },

        students: {
          select: {
            RollNo: true,
            name: true,
          },
        },
      },
    });
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

exports.classRecord = async (req, res, next) => {
  try {
    console.log("inside class record..............", req.body.currentClass.id);
    const { role } = req.User;
    let currentClass = [];
    if (!validateUser.checkStudent(role)) {
       currentClass = await prisma.attendanceRecord.findMany({
        where: {
          classId: req.body.currentClass.id,
        },
        include: {
          attendances: {
            select: {
              studentId: true,
              isPresent: true,
            },
          },
        },
      });
    }
    else {
      next(new ErrorResponse("Unauthorized route", 401));
    }

    console.log(" currentClass", currentClass);
    res.status(200).json({
      success: true,
      classRecord: currentClass,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message | "server error",
    });
  }
};