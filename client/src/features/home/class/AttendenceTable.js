import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from '../../../hooks';
import { useNavigate } from "react-router-dom";
import { getClassesAsync } from '../class/classes.slice';
import useGetHeight from "../../../custom hooks/useGetHeight";
import { classTableHead } from "../../../models/studentAttendence.model";
import axios from 'axios';

const AttendenceTable = ({attendenceList, classId}) => {
  const navigate = useNavigate();

  const [classes, setClasses] = React.useState({});
  useEffect(()=>{
    let list = typeof attendanceList !== 'undefined' ?
     attendenceList.filter(list => list.id == classId ) : [];
    setClasses(list[0])   
  },[])

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
            {typeof classes !== 'undefined' && classes.length <=0 ? (
              "NO Classes found"
            ) :typeof classes !== 'undefined' && classes.AttendanceRecord &&
             classes.AttendanceRecord.attendances.map(item => (
              <TableRow key={item.id} hover>
                <TableCell style={{minWidth: 100}}>{item.id}</TableCell>
                <TableCell style={{minWidth: 100}}>{item.createdAt}</TableCell>
                <TableCell style={{minWidth: 200}}>{item.isPresent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    
    </>
  );
};

export default AttendenceTable;