import  React, {useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function BasicTable({ studentClass, getCheckedAttendance, classRecord, selectedRecord, doUpdate }) {
    const rows = [];
    let presentStudents = [];
    const [isUpdate, setIsUpdate] = React.useState(false);
    useEffect(() => {
        doUpdate ? setIsUpdate(true) : setIsUpdate(false);

      }, []);
    console.log(selectedRecord, ".......selectedRecord...........");
    let editRecord = null
    if(selectedRecord) {
        editRecord = classRecord.find((record) => record.id == selectedRecord);
        editRecord.attendances.forEach(element => {
            rows.push({ id: element.studentId, isPresent: element.isPresent });
            if (element.isPresent) 
                presentStudents.push(element.studentId);
        });
    }
    else if (studentClass) {
        studentClass.students.forEach(element => {
            rows.push({ id: element.RollNo, isPresent: false });
        });
    }

    console.log(rows, ".............rows..........");
  

    const handleChange = (event)=> {
        if (event.target.checked) {
             presentStudents.push(event.target.value)} 
        else {
            presentStudents =  presentStudents.filter(val => val != event.target.value)
        }
        getCheckedAttendance(presentStudents);
        console.log(presentStudents, "value...");
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>RollNo</TableCell>
                        <TableCell align="right">IsPresent</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">
                     
                                <input type="checkbox" 
                                defaultChecked={row.isPresent}
                                value={row.id} 
                                onChange={handleChange} />                           
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
