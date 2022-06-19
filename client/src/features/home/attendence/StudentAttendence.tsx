import { ArrowBackOutlined, Edit } from "@mui/icons-material";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from '../../../hooks';
import { useNavigate } from "react-router-dom";
import { ICreateClass } from "../../../models/class.model";
import { getClassesAsync } from '../class/classes.slice';
import { getAttendenceRecordAsync } from '../attendence/attendence.slice';
import useGetHeight from "../../../custom hooks/useGetHeight";
import { StudentAttendenceTableHead } from "../../../models/attendence.model";
import axios from 'axios'
import { IAttendenceRecord } from './attendence.slice';

const StudentAttendence = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [studentId, setStudentId] = React.useState('');
  const [classId, setClassId] = React.useState('');
  const [attendence, setAttendence] = React.useState([])

  useEffect(()=>{
    const getClasses = async () => await dispatch(getClassesAsync(localStorage.getItem('token') as string));
    getClasses();
    var url = (window.location).href;
    var newURL = url.split('/', 10);
    var classId = url.substring(url.lastIndexOf('/') + 1);
    var studentId = newURL[4];
    setClassId(classId);
    setStudentId(studentId);
    const getAttendence = async () => await dispatch(getAttendenceRecordAsync(localStorage.getItem('token') as string));
    getAttendence();
    axios.get(`/attendence/student-attendence/${classId}/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setAttendence(res.data.attendance)
    }).catch(err => console.log(err))
  },[])
  const { classes } = useAppSelector(state=> state.class);
  const { attendenceRecord } = useAppSelector(state=> state.attendence);
  console.log('classes',classes);
  console.log('attendence',attendenceRecord);
  const handleCLick = () => {
    navigate(`/get-all-attendence/${classId}`);
    
  };    
    const handleStatus = () => {
  };
  
 // console.log('hello')
  return (
    <>
      <Button
        onClick={handleCLick}
        variant="contained"
        color="primary"
        startIcon={<ArrowBackOutlined />}
      >Go Back</Button>
      <br /> <br />
      <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer
        sx={{maxHeight: (+useGetHeight().height-175)}}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {StudentAttendenceTableHead.map((item, index) => (
                <TableCell sx={{ fontWeight: 'bold'}} key={index}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!attendence ? (
              "NO Records found"
            ) : attendence.map((item: IAttendenceRecord,i:any) => (
              <TableRow key={item.id} hover>
                {console.log("item",item)}
                <TableCell style={{minWidth: 100}}>{i+1}</TableCell>
                {/* <TableCell style={{minWidth: 100}}>{item.courseId}</TableCell> */}
                <TableCell style={{minWidth: 100}}>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                 <TableCell style={{minWidth: 100}}>
                  <input
                    type="checkbox"
                    id="1"
                    value="2"
                    checked={item.isPresent}
                    onChange={handleStatus}
                  />
                </TableCell>                <TableCell style={{minWidth: 100}}>
                  {item.isPresent ? 'P' : 'A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </>
  );
};

export default StudentAttendence;