import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const clientSlice=createSlice({
    name:"client",
    initialState,
    reducers:{
        SetClient: (state,action) =>{
            return action.payload;
        },
        AddClient: (state,action) =>{
            const data = action.payload;
            const exitsItem = state.findIndex((item) => item.idND === data.idND);
            if (exitsItem === -1) {
                const newClient = {
                    stt: state.length +1,
                    idND : data.idND,
                    tenND : data.tenND,
                    diem : data.diem,
                    sdt: data.sdt,
                    email : data.email,
                    ngaySinh : data.ngaySinh,
                    cccd: data.cccd,
                    anh: data.anh,
                    gioiTinh: data.gioiTinh,
                    maND: data.maND,
                    trangThai: data.trangThai,
                }
                state.unshift(newClient);
                state.forEach((item, index) => {
                    item.stt = index + 1;
                });
            }
        },
        RemoveClient : (state,action)=> {
            return state.filter((item) => item.idND !== action.payload.idND )

        }
    }
})
export const {AddClient,RemoveClient} = clientSlice.actions;
export default clientSlice.reducer;
export const GetClient = (state) => state.client