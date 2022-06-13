export interface ICreateAttendeceRecord {
    id?: number,
    createdAt: Date,
    updatedAt: Date,
    isPresent: boolean,
    studentId: string,
    attendanceRecordId: number,
    attendanceRecord: any,
}

export const StudentAttendenceTableHead = ['Attendence Id', 'Date', 'Status', 'Attendence'];