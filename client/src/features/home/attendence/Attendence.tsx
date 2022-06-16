import React, {useEffect} from "react";
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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

const Attendence = () => {
let studentAttendances = '';

const [classesData, setClassesData] = React.useState([]);
 const [className, setClassName] = React.useState('');
  useEffect(() => {
    // Update the document title using the browser API
    let token = localStorage.getItem('token') as string; 
    axios.get(`/class/get-students`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("response ....", res.data.classes[0].course.courseName);
      
      handleClassName(res.data.classes);

      setClassesData(res.data.classes);
    })
  }, []);

  const [value, setValue] = React.useState<Date | null>(
    new Date('2022-06-22'),
  );
  const [studentClass, setStudentClass] = React.useState('');
  const [studentClassId, setStudentClassId] = React.useState();
  const [classRecord, setClassRecord] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState('');
 
  const [doUpdate, setDoUpdate] = React.useState(false); 
  const onSelectRecord = (data: string) => {
    setSelectedRecord(data[0])
    setDoUpdate(true);
  }
  function handleClassChange (event: any) {
    console.log("receviedd ....", event);
    setStudentClassId(event.id);
    setStudentClass(event);
    setDoUpdate(false);
    let token = localStorage.getItem('token') as string; 
    axios.post(`/class/class-record`,{ currentClass: event }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("response ...currentClass.", res);
      setClassRecord(res.data.classRecord);
      console.log("currentClass.", res.data.classRecord);
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
    setValue(newValue);
  };
  function handleClassName (newdata :any){
    console.log("newdata",newdata);
    var url = (window.location).href;
    var newURL = url.split('/', 10);
    var classId = newURL[4];
    for(let i=0; i<newdata.length;i++){
        if(newdata[i].id==classId){
          setClassName(newdata[i].course.courseName);
          handleClassChange(newdata[i]);
        }
      }
  };

  const getCheckedAttendance = ( checkedStudents: string)=> {
    studentAttendances = checkedStudents;
    console.log(studentAttendances, ".....checkedStudents......");
  }
  const submitAttendence = () =>{
    console.log("submit attendence......");
    let token = localStorage.getItem('token') as string; 
    axios.post(`/attendence/create-attendence`,{
      date: value,
      presents:studentAttendances,
       currentClass: studentClass,
       doUpdate: doUpdate,
       selectedRecord: selectedRecord
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
        // elevation={4}
        
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  {/* <DatePicker
                    label="Select Date"
                    inputFormat="dd/MM/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                    disabled = {doUpdate}
                  /> */}
                  <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
        />
                </Stack>
              </LocalizationProvider>
              <Grid>
                <Typography
                  variant="h2"
                  component="h2"
                  fontSize="25px"
                  align="left"
                  marginRight="15px"
                >
                Class Name: {className}
              </Typography>
              </Grid>
              {/* <Drop
                studentClass = {studentClass}
                classesData = {classesData}
                handleClassChange={handleClassChange}
              /> */}
              {/* <Grid container justifyContent={"space-between"}>
              
              </Grid> */}
            </Grid>
            <AttendenceTable 
              studentClass = {studentClass}
              getCheckedAttendance = {getCheckedAttendance}
              classRecord = {classRecord}
              selectedRecord = {selectedRecord}
              doUpdate = {doUpdate}
              studentClassId = {studentClassId}
              selectedDate={value}
            />

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  errors.courseId ||
                    errors.courseName ||
                    errors.creditHours
                    ? true
                    : false
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
      <ListClassRecord classRecord = {classRecord} onSelectRecord = {onSelectRecord}/>

    </>
  );
};

export default Attendence;
