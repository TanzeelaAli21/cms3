import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from '../../../hooks';
import { useNavigate } from "react-router-dom";
import { getClassesAsync } from '../class/classes.slice';
import useGetHeight from "../../../custom hooks/useGetHeight";
import { classTableHead } from "../../../models/class.model";
import axios from 'axios';
// {getStudentAttendence}
const StudentTable = () => {
  const navigate = useNavigate();
  const { classes } = useAppSelector(state=> state.class);
  console.log('classes',classes);
  const handleCLick = () => {
    navigate("/create-class");
  };    
  return (
    <>
  
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {classTableHead.map((item, index) => (
                <TableCell sx={{ fontWeight: 'bold'}} key={index}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length <=0 ? (
              "NO Classes found"
            ) : classes.map(item => (
              <TableRow key={item.id} hover>
                <TableCell style={{minWidth: 100}}>{item.id}</TableCell>
                <TableCell style={{minWidth: 100}}>{item.course.courseId}</TableCell>
                <TableCell style={{minWidth: 200}}>{item.course.courseName}</TableCell>
                <TableCell style={{minWidth: 100}}>
                  {/* <IconButton onClick={() => getStudentAttendence()} color="success" > <Edit /> </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    
    </>
  );
};

export default StudentTable;