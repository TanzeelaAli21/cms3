import React, {Fragment, useEffect,useState} from "react";
// import * as React, { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import * as yup from "yup";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useHandleFormik from "../../../custom hooks/useHandleFormik";
import { makeStyles } from "@mui/styles";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../../hooks';
import { createAlert } from '../../../components/slices/alertify.slice';
import Drop from "../../../components/dropdown/Drop";
import Checkbox from "../../../components/checkbox/Checkbox";
import ListClassRecord from "../../../components/classList/ClassList";
import AttendenceTable from "../../../components/table/Table";

import agent from '../../../api/agent';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getAttendenceRecordAsync } from '../attendence/attendence.slice';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from 'axios';

let initialValue = {
  courseId: "",
  courseName: "",
  creditHours: "",
};



const validationSchema = yup.object().shape({
  courseId: yup
    .string()
    .required("courseId is required")
    .min(3, "minimum three characters are required"),
  courseName: yup
    .string()
    .required("course name is required")
    .min(3, "minimum three characters are required"),
  creditHours: yup
    .number()
    .required("credit hours is required")
    .positive('credit hours are always positive')
    .min(1, "credit number can not be less than 1")
    .max(5, "credit hours can not be greater than 5")
});

const useStyles = makeStyles({
  paper: {
    padding: "20px",
  },
});

const AllStudentAttendence = () => {

let studentAttendances: any[] = [];
// let newArray:any = [];
let newChecked:any = [];
let selectedAttendencesIds:any = [];
 let rows:any =[];
let newDate = '';
  const [classesData, setClassesData] = React.useState([]);
  const [attendenceDataNext, setAttendenceDataNext] = useState<any[]>([]);
  const [className, setClassName] = React.useState('');
  const [attendenceData, setAttendenceData] = useState<any[]>([]);
  const [newArray, setNewArray] = useState<any[]>([]);
  const [newArrayLength, setNewArrayLength] = useState(0);
  // const newClassId, setNewClassId] = React.useState(0);
  const getData = async () => {
    var url = (window.location).href;
    var classId = url.substring(url.lastIndexOf('/') + 1);
    let token = localStorage.getItem('token') as string;
    axios.get(`/attendence/get-all-attendence`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        cid: classId
      }
    }).then((res) => {
      setAttendenceData(res.data.classes.students);
      // newArray= res.data.classes.students[0].studentAttendance;
      setNewArray (res.data.classes.students[0].studentAttendance);
      setNewArrayLength(newArray.length);
      
      console.log("newArray",res.data)
    }).catch(error=>console.log('error123',error));
  };
  useEffect(() => {
    let token = localStorage.getItem('token') as string; 
    axios.get(`/class/get-students`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      handleClassName(res.data.classes);
      setClassesData(res.data.classes);
    })
    getData();
  }, []);

  const [value, setValue] = React.useState<Date | null>(new Date());
  
  const [studentClass, setStudentClass] = React.useState('');
  const [first, setFirst] = React.useState('');
  const [studentClassId, setStudentClassId] = React.useState();
  const [classRecord, setClassRecord] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState('');
  const [newID, setNewID] = React.useState(0);
 
  const [doUpdate, setDoUpdate] = React.useState(false); 
  const onSelectRecord = (data: string) => {
    setSelectedRecord(data)
    setDoUpdate(true);
  }
  function handleClassChange (event: any) {
    console.log("receviedd ....", event);
    setStudentClassId(event.id);
    setStudentClass(event);
    newChecked = event;
    setDoUpdate(false);
    let token = localStorage.getItem('token') as string; 
    axios.post(`/class/class-record`,{ currentClass: event }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("response ...currentClass.", res);
      console.log("currentClass.", res.data.classRecord);
      setClassRecord(res.data.classRecord);
    })
    .catch((err) => {
      console.log("err........", err);
      dispatch(createAlert({
        message: err.message as string,
        open: true,
        severity: "error"
      }));
      
    } )
  };
  const handleChange = (newValue: Date | null) => {
    console.log("newValue",newValue);
    let n:any =  newValue;
    let y:any = n.getFullYear();
    let m:any = n.getMonth() + 1;
    let d:any = n.getDate();
    newDate = m + "/" + d + "/" + y;
    setValue(newValue);
    setFirst(m + "/" + d + "/" + y);
  };
  function handleClassName (newdata :any){
    console.log("newdata",newdata);
    var url = (window.location).href;
    var newURL = url.split('/', 10);
    var classId = newURL[4];
    setNewID(parseInt(classId));
    //  setNewClassId(classId);
    for(let i=0; i<newdata.length;i++){
        if(newdata[i].id==classId){
          setClassName(newdata[i].course.courseName);
          handleClassChange(newdata[i]);
        }
      }
  };

  // const getCheckedAttendance = ( checkedStudents: string)=> {
  //   studentAttendances = checkedStudents;
  //   console.log(studentAttendances, ".....checkedStudents......");
  // }
  const submitAttendence = () =>{
    console.log("submit attendence......", selectedAttendencesIds);
    let token = localStorage.getItem('token') as string; 
    axios.post(`/attendence/create-attendence`,{
      date: value,
      presents: localStorage.getItem("presents"),
       currentClass: studentClass,
       doUpdate: doUpdate,
       selectedRecord: localStorage.getItem("selectedAttendencesIds")
      } ,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("response ....", res);
      console.log("res.data.classes ....", );
      setClassesData(res.data.classes);
      dispatch(createAlert({
        message: res.data.message as string,
        open: true,
        severity: "success"
      }));
      window.location.reload();
    })
    .catch((err) => {

    })
  
  }
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleAddCourseSubmit = async () => {
    const response = await agent.course.addCourse(localStorage.getItem('token') as string, values);
    console.log(response);
    if (response.success)
      dispatch(createAlert({
        message: response.message as string,
        open: true,
        severity: "success"
      }));
    else
      dispatch(createAlert({
        message: response.message as string,
        open: true,
        severity: "error"
      }));
    if (response.success)
      setTimeout(() => {
        navigate("/mark-attendence");
      }, 500);
  };

    const handleSelectAll = () => {
      newChecked = studentClass;
      newChecked.students.map((element:any, index:any) => {
      const checkbox = document.getElementById( `${element.RollNo}`, ) as HTMLInputElement | null;
      
      if (checkbox != null) {
        checkbox.checked = true;
      }
      });
    };  

      const handleUnselectAll = () => {
      newChecked = studentClass;
      newChecked.students.map((element:any, index:any) => {
      const checkbox = document.getElementById( `${element.RollNo}`, ) as HTMLInputElement | null;
      if (checkbox != null) {
        checkbox.checked = false;
      }
      });
  };
  const handleCheckBoxChange = (event:any) => {
    
      if (event.target.checked) {
        rows.push(event.target.value);
      } else{
        rows = rows.filter(
        (val:any) => val != event.target.value
      );
      }
      localStorage.setItem("presents", rows)
      studentAttendances = rows;
      console.log("eventevent",event);
      console.log("...............inside checbox....................",studentAttendances);


  };
    const edeitAttendence = (event:any, index:any) => {
      console.log(newArray, ".........newArray........");
      console.log(index, ".........index........");

      console.log(attendenceData, ".........attendenceData........");
      
     const editStudentList = attendenceData.map((stu) => {
       return stu.studentAttendance[index]
      })
      console.log(editStudentList, "......editStudentList.......");
      let selectedIds = editStudentList.map((att) => {
        let ele = JSON.parse(att);
        return ele.id
      })
      selectedAttendencesIds = selectedIds;
      localStorage.setItem("selectedAttendencesIds", selectedAttendencesIds)
      console.log(selectedAttendencesIds, "........selectedAttendencesIds.......");
      // setDoUpdate(true);
      // onSelectRecord(selectedIds);

      event = JSON.parse(event);
      console.log("eventevent",event);
      newChecked = studentClass;
      editStudentList.map((element:any, index:any) => {
      let val = JSON.parse(element)  
      const checkbox  = document.getElementById( `${val.studentId}`, ) as HTMLInputElement | null;
      
      if (checkbox != null) {
        if (val.isPresent) {
          checkbox.checked = true;
        }
        else {
          checkbox.checked = false;
        }
        setDoUpdate(true);
        // setSelectedRecord(event);

        checkbox.addEventListener('change', handleCheckBoxChange)  
        const eventL = new Event('change');  
        checkbox.dispatchEvent(eventL);
      
      }
      });

      if (event.isPresent) {
        const checkbox = document.getElementById( `${event.stuentId}`, ) as HTMLInputElement | null;
        console.log(checkbox, "....checkbox");
        
        if (checkbox != null) {
          checkbox.checked = true;
        }
      }
    //  let editElement =  newArray.filter((arr) => arr.id == event.id)
     
  };
  
 
  const { getFieldProps, handleSubmit, touched, errors, values } = useHandleFormik(
    initialValue,
    validationSchema,
    handleAddCourseSubmit
  );
  return (
    <>
      <Button
        sx={{ marginBottom: "15px" }}
        startIcon={<ArrowBackOutlined />}
        color="primary"
        variant="contained"
        onClick={() => navigate("/view-class")}
      >
        Go Back
      </Button>
      <Paper
        className={classes.paper}
        variant="elevation"
        elevation={4}
      >
        <form noValidate onSubmit={handleSubmit}>
          <Stack sx={{ mt: 1 }}>
            <Typography
              variant="h1"
              component="h1"
              fontSize="30px"
              align="center"
              marginBottom="30px"
            >
              Mark Attendance
            </Typography>
            <Grid container justifyContent={"space-between"}>
              <Grid sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>             
                  <DatePicker
                  label="Date"
                  inputFormat="MM/dd/yyyy"
                  value={value} 
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                 />
                </Stack>
              </LocalizationProvider>
              </Grid>
              <Grid sm={6} alignContent={"end"}>
                <Typography
                  variant="h2"
                  component="h2"
                  fontSize="25px"
                  align="right"
                  marginRight="15px"
                >
                Class Name: {className}
              </Typography>
              </Grid>
              <Grid  spacing={3}>
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
              <Button
                sx={{ marginBottom: "15px", marginTop: "15px", marginLeft: "10px" }}
                style={{
                  backgroundColor: "white",
                  color: "grey",
                }}
                variant="contained"
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
              </Grid>
            </Grid>
               <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr No.</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>
              <Typography style={{
                fontWeight: "bold"
              }}>
              {first!='' && first!=null ?first:new Date().toLocaleDateString()}
              </Typography>
              </TableCell>
            {newArray.sort((a, b) => (a.id > b.id ? 1 : -1)).map((key:any, i:any)=>(
            // <Fragment >
                <TableCell colSpan={newArrayLength}>
                        <Grid
                          style={{
                            textAlign: "center",
                          }}
                        >
                        <Button  onClick={() => edeitAttendence(key, i)}>Edit</Button>
                        {/* |<Button>D</Button> */}
                        <Typography>{new Date(JSON.parse(key).attendanceRecord.createdAt).getDate()+" "+new Date(JSON.parse(key).createdAt).toLocaleString('default', { month: 'long' })}</Typography>
                        {/* <center>08</center> */}
                      </Grid>
                    </TableCell>
                  // </Fragment>
                  ))}
                  <TableCell>
                    Total Absent
                  </TableCell>
                  <TableCell>
                    Total Present
                  </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendenceData.sort((a, b) => (a.id > b.id ? 1 : -1)).map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                 <Button
                 onClick={() =>
                      navigate(
                        `/student-attendence/${item.RollNo}/${newID}`
                      )
                    }
                 >{item.RollNo}</Button> 
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    id={item.RollNo}
                    value={item.RollNo}
                    onChange={handleCheckBoxChange}
                  />
                </TableCell>
                {item.studentAttendance.map((key:any, i:any, row:any)=>(
                  <Fragment key={i}>
                    <TableCell align="center">{JSON.parse(key).isPresent?"P":"A"}</TableCell>
                  </Fragment>
                  ))}
                  <TableCell >{item.totalAbsent}</TableCell>
                  <TableCell >{item.totalPresent}</TableCell>
                  </TableRow>
            ))}
                  
        </TableBody>
      </Table>
    </TableContainer>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-evenly", alignItems: "center", }} >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  errors.courseId ||
                  errors.courseName ||
                  errors.creditHours? true : false
                }
                startIcon={<Save />}
                fullWidth
                onClick={submitAttendence}
              >
                Submit Attendance
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

    </>
  );
};

export default AllStudentAttendence;
