import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import agent from '../../../api/agent';
import { id } from 'date-fns/locale';

export const getAttendenceRecordAsync = createAsyncThunk('admin/classes', async (token: string, {rejectWithValue})=>{
    const response = await agent.attendence.getAttendence(token);
    if(response.success){
        return response.classes;
    }else{
        return rejectWithValue(response.message as string)
    }
})

export interface IAttendenceRecord {
    id?: number,
    createdAt: Date,
    updatedAt: Date,
    isPresent: boolean,
    studentId: string,
    attendanceRecordId: number,
    attendanceRecord: any,
}

export interface IAttendenceRecordState {
    attendenceRecord: IAttendenceRecord[],
    isLoading: true | false,
    errorMessage: string
}

const initialState: IAttendenceRecordState = {
    attendenceRecord: [],
    isLoading: true,
    errorMessage: ''
}

const attendenceSlice = createSlice({
    name: 'attendence',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(getAttendenceRecordAsync.pending, (state)=>({...state, isLoading: true}))
        builder.addCase(getAttendenceRecordAsync.rejected, (state, action)=> ({attendenceRecord: [] , isLoading: false, errorMessage: action.error.message || 'error'}))
        builder.addCase(getAttendenceRecordAsync.fulfilled, (state, action)=>({
            attendenceRecord: action.payload,
            isLoading: false,
            errorMessage: ''
        }))
    }
})

export const {} = attendenceSlice.actions;

export const getAttendenceSelector = (state: RootState) => state.attendence;

export default attendenceSlice.reducer;