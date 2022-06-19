import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from '../../../hooks';
import { useNavigate } from "react-router-dom";
import { getClassesAsync } from '../class/classes.slice';
import useGetHeight from "../../../custom hooks/useGetHeight";
import { classTableHead } from "../../../models/class.model";
import StudentTable from "./StudentTable";
import AttendenceTable from "./AttendenceTable";

import axios from 'axios';

const ViewClasses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [attendenceList, setAttendenceList] = React.useState([]);
  useEffect(()=>{
    const getClasses = async () => await dispatch(getClassesAsync(localStorage.getItem('token') as string));
    getClasses();
    setAttendenceList([])
    
  },[])
  const { classes } = useAppSelector(state=> state.class);
  let classId = '';
  console.log('classes',classes);
  const handleCLick = () => {
    navigate("/create-class");
  };    

const getStudentAttendence = (classId: string) => {
        classId = classId
        let token = localStorage.getItem('token') as string; 
        axios.get(`/student/get-student-attendence`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
            classId
        }
      }).then((res) => {
        // console.log("mawra", res.data);
        setAttendenceList(res.data)
        console.log(attendenceList, "attendenceList");
        
      }).catch(error=>console.log('error123',error));
}  
  return (
    <>
      <Button
        onClick={handleCLick}
        variant="contained"
        color="primary"
        startIcon={<Add />}
      >Add Class</Button>
      <br /> <br />
      <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer
        sx={{maxHeight: (+useGetHeight().height-175)}}
      >
          {(attendenceList.length === 0) ?
                 <StudentTable getStudentAttendence = {getStudentAttendence}/>
            :
                <AttendenceTable attendenceList = {attendenceList} classId = {classId}/>
            }

      </TableContainer>
      </Paper>
    </>
  );
};

export default ViewClasses;