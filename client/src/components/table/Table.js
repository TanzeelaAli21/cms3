import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

export default function BasicTable({
  studentClass,
  getCheckedAttendance,
  classRecord,
  selectedRecord,
  doUpdate,
  studentClassId,
  selectedDate,
}) {
  const rows = [];
  let presentStudents = [];
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [studentPresent, setStudentPresent] = React.useState(0);
  const [selectedDate1, setSelectedDate1] = React.useState(selectedDate);
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
  console.log(studentClass, ".............studentClass44..........");
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
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
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
            <TableCell align="left">
              <Button
                sx={{
                  marginBottom: "15px",
                  marginTop: "15px",
                  marginRight: "70px",
                }}
                style={{
                  backgroundColor: "white",
                  color: "grey",
                  align: "left",
                }}
                variant="contained"
                onClick={handleUnSelectAll}
              >
                Unselect All
              </Button>
            </TableCell>
            <TableCell></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr No.</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>16-06-2022</TableCell>
            <TableCell>
              <Grid
                style={{
                  textAlign: "center",
                }}
              >
                <Button>E</Button>|<Button>D</Button>
                <br />
                <center>08</center>
              </Grid>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((row, i) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>Mawra Shafqat</TableCell>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    id={row.id}
                    value={row.id}
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell align="center">P</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
