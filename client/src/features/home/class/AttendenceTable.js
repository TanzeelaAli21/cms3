import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { getClassesAsync } from "../class/classes.slice";
import useGetHeight from "../../../custom hooks/useGetHeight";
import { classTableHead } from "../../../models/studentAttendence.model";
import axios from "axios";

const AttendenceTable = ({ attendenceList, classId }) => {
  const navigate = useNavigate();
  console.log(attendenceList, "............attendenceList............");
  let classes = attendenceList.attendance.filter((att) => att.id == classId);
  console.log(classId, "............classes............");

  console.log("classes", classes);
  const handleCLick = () => {
    navigate("/create-class");
  };
  return (
    <>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {classTableHead.map((item, index) => (
              <TableCell sx={{ fontWeight: "bold" }} key={index}>
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.length <= 0
            ? "NO Classes found"
            : classes[0] &&
              classes[0].AttendanceRecord &&
              classes[0].AttendanceRecord[0] &&
              classes[0].AttendanceRecord[0].attendances.map((item, i) => (
                <TableRow key={item.id} hover>
                  <TableCell style={{ minWidth: 100 }}>{i + 1}</TableCell>
                  <TableCell style={{ minWidth: 100 }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ minWidth: 200 }}>
                    {item.isPresent ? "P" : "A"}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AttendenceTable;
