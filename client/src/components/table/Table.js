import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BasicTable({
  studentClass,
  getCheckedAttendance,
  classRecord,
  selectedRecord,
  doUpdate,
  studentClassId,
}) {
  const rows = [];
  let presentStudents = [];
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [studentPresent, setStudentPresent] = React.useState(0);
  const [studentAttendanceStatus, setStudentAttendanceStatus] = React.useState(
    []
  );
  useEffect(() => {
    doUpdate ? setIsUpdate(true) : setIsUpdate(false);
  }, []);
  console.log(selectedRecord, ".......selectedRecord...........");
  console.log(studentClassId, "studentClassId");
  console.log(studentClass, "studentClassId1");
  let editRecord = null;
  var presentStatusData = [];
  // let resultArray = [];
  // let studentData = {};
  // let present = 0;
  // let absent = 0;
  // for (let i = 0; i < classRecord.length; i++) {
  //   const testArray = [];
  //   for (let j = 0; j < classRecord[i].attendances.length; j++) {
  //     if (classRecord[i].attendances[j].isPresent === true) {
  //       // newClassData.push({
  //       //   studentId: classRecord[i].attendances[j].studentId,
  //       //   present: present++,
  //       //   absent: absent,
  //       // });
  //       studentData = {
  //         studentId: classRecord[i].attendances[j].studentId,
  //         present: present++,
  //         absent: absent,
  //       };
  //       testArray.push(studentData);
  //     } else {
  //       // newClassData.push({
  //       //   studentId: classRecord[i].attendances[j].studentId,
  //       //   absent: absent++,
  //       //   present: present,
  //       // });
  //       studentData = {
  //         studentId: classRecord[i].attendances[j].studentId,
  //         present: present,
  //         absent: absent++,
  //       };
  //       testArray.push(studentData);
  //     }
  //   }
  //   resultArray.push(testArray);
  // }
  // console.log("resultArray", resultArray);
  if (selectedRecord) {
    editRecord = classRecord.find((record) => record.id == selectedRecord);
    editRecord.attendances.forEach((element) => {
      rows.push({ id: element.studentId, isPresent: element.isPresent });
      if (element.isPresent) {
        presentStudents.push(element.studentId);
        console.log("element.studentId", element.studentId);
      }
      document.getElementById(`${element.studentId}`).checked =
        element.isPresent;
    });
  } else if (studentClass) {
    studentClass.students.forEach((element) => {
      rows.push({ id: element.RollNo, isPresent: false });
    });
  }
  console.log(rows, ".............rows..........");
  const navigate = useNavigate();
  const handleSelectAll = () => {
    rows.forEach((element, index) => {
      if (element.id) {
        rows[index].isPresent = true;
        presentStudents.push(element.id);
      }
      document.getElementById(`${element.id}`).checked = true;
    });
    getCheckedAttendance(presentStudents);
  };
  const handleUnSelectAll = () => {
    rows.forEach((element, index) => {
      if (element.id) {
        rows[index].isPresent = false;
      }
      document.getElementById(`${element.id}`).checked = false;
    });
    presentStudents = [];
    getCheckedAttendance(presentStudents);
  };
  const handleChange = (event) => {
    if (event.target.checked) {
      presentStudents.push(event.target.value);
      rows.forEach((element, index) => {
        if (element.id === event.target.value) {
          rows[index].isPresent = true;
        }
      });
    } else {
      presentStudents = presentStudents.filter(
        (val) => val != event.target.value
      );
      rows.forEach((element, index) => {
        if (element.id === event.target.value) {
          rows[index].isPresent = false;
        }
      });
    }
    getCheckedAttendance(presentStudents);
    console.log(presentStudents, "value...");
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Roll No</TableCell>
            <TableCell align="center">IsPresent</TableCell>
            <TableCell align="center">View</TableCell>
            <TableCell align="right">
              <Button
                sx={{ marginBottom: "15px", marginTop: "15px" }}
                style={{
                  backgroundColor: "white",
                  color: "grey",
                }}
                variant="contained"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
            </TableCell>
            <TableCell align="right">
              <Button
                sx={{ marginBottom: "15px", marginTop: "15px" }}
                style={{
                  backgroundColor: "white",
                  color: "grey",
                }}
                variant="contained"
                onClick={handleUnSelectAll}
              >
                Unselect All
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    id={row.id}
                    value={row.id}
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/student-attendence/${row.id}/${studentClassId}`
                      )
                    }
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
                {/* {newClassData.map((data, index) => {
                  row.id == data[index].studentId ? (
                    <TableCell>{data[index].present}</TableCell>
                  ) : (
                    <TableCell></TableCell>
                  );
                })} */}
                <TableCell align="center"></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
