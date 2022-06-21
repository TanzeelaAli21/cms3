const prisma = require('../getPrisma');
const validateUser = require('../utils/checkAuthorization');
const ErrorResponse = require('../utils/Error');

exports.ViewStudents = async (req, res, next) => {
    try {

        const { name, rollNo } = req.query;
        const { role } = req.User;
        if (!validateUser.checkAdmin(role))
            next(new ErrorResponse('Unauthorized route', 401));
        const allStudents = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                AND: [
                    {
                        name: {
                            contains: name ? name : ''
                        }
                    },
                    {
                        RollNo: {
                            startsWith: rollNo ? rollNo : ''
                        }
                    }
                ]
            },
            orderBy: {
                RollNo: "asc"
            }
            ,
            select: {
                id: true,
                name: true,
                father_name: true,
                cnic: true,
                DOB: true,
                active: true,
                email: true,
                RollNo: true
            }
        });
        res.status(200).json({
            success: true,
            students: allStudents
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message | "server error"
        })
    }
};

exports.AddStudent = async (req, res, next) => {
    try {
        const { role } = req.User;
        if (!validateUser.checkAdmin(role))
            next(new ErrorResponse('Unauthorized route', 401));
        const { name, fatherName, cnic, DOB, degree, shift, email } = req.body;
        if (!name || !fatherName || !cnic || !DOB || !degree || !shift || !email)
            next(new ErrorResponse("invalid information"));
        const batch = (+(new Date().getFullYear().toString().slice(-2)));
        const usersLength = (await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                RollNo: {
                    startsWith: `${degree}`
                },
                shift: `${shift}`,
                batch: batch
            }
        })).length
        if (usersLength >= 60)
            next(new ErrorResponse("max students reached for a session"));
        const checkUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email
                    },
                    {
                        cnic: cnic
                    }
                ]
            }
        })
        if (checkUser)
            next(new ErrorResponse("invalid unique credidentials", 400));
        const addStudent = await prisma.user.create({
            data: {
                name: name,
                father_name: fatherName,
                cnic: cnic,
                DOB: DOB,
                email: email,
                password: 'pucitnc123',
                batch: batch,
                shift: `${shift}`,
                role: 'STUDENT',
                active: true,
                RollNo: `${degree}F${batch}${shift}5${usersLength < 10 ? '0' : ''}${(usersLength + 1)}`,
                designation: 'STUDENT'
            }
        })
        res.status(200).json({
            success: true,
            message: "Student added successfully"
        });
    } catch (error) {
        next(new ErrorResponse(error.message || "server error", 500));
    }
}

exports.EditStudent = async (req, res, next) => {
    try {

    } catch (error) {
        next(new ErrorResponse(error.message || "server error", 500));
    }
}

exports.getStudentAttendence = async (req, res, next) => {
    try {
        const { role } = req.User;
        const {  classId } = req.query;
        const id = req.User.id
        const arecords = await prisma.attendanceRecord.findMany({
            where: {
                studentIds: {
                    has: parseInt(id)
                }
            },
        })
        console.log(req.User, "..........req.User.RollNo id.........");

        // if (!validateUser.checkStudent(role)) {
        //     next(new ErrorResponse("Unauthorized route", 401));
        // }
        const classData = await prisma.class.findMany({
            where: {
                id: parseInt(classId)
            },
            select: {
                id: true,
                course: {
                    select: {
                        id: true,
                        courseName: true,
                    }
                },
                teacher: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                AttendanceRecord: {
                    where: {
                        studentIds: {
                            has: parseInt(id)
                        }
                    },
                    select: {
                        id: true,
                        createdAt: true,
                        attendances: {
                            where: {
                                studentId: req.User.RollNo
                            },
                            select: {
                                id: true,
                                createdAt: true,
                                isPresent: true,
                            }
                        }
                    }
                }
            },
            // ,
           
        })
        console.log(JSON.stringify(classData), "........classData..........");
        res.status(200).json({
            success: true,
            attendance: classData,
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