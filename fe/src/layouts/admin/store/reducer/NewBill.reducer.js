import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const newBillSlice = createSlice({
    name : "newBill",
    initialState,
    reducers: {
        LoadNewBill(state,action){
            const data =action.payload;
            const index = state.findIndex((item) => item.key === data.key);
            if (index === -1){
                const newBill = {
                key: data.key,
                idHDCT:data.idHDCT,
                stt: state.length+1,
                idCTSP: data.idCTSP,
                tenSP: data.tenSP,
                soLuong: data.soLuong,
                donGia: data.donGia,
                tongTien:data.tongTien,
                tenKT:data.tenKT,
                tenMS:data.tenMS,
                ghiChu:null,
                }
                state.unshift(newBill);
                state.forEach((item,index) => {
                    item.stt = index + 1;
                });
            }
        },
        UpdateNewBill (state, action){
            const data = action.payload;
            const index = state.findIndex((item) => item.key === data.key);
            if (index !== -1){
              state[index].soLuong = data.soLuong;
              state[index].tongTien = parseFloat(data.soLuong) * parseFloat(state[index].donGia);
            }
        },
        UpdateGhiChuBill (state, action){
            const data = action.payload;
            const index = state.findIndex((item) => item.key === data.key);
            if (index !== -1){
              state[index].ghiChu=data.ghiChu;
            }
        },
        DeleteNewBill(state,action){
            return initialState;

        }
    }
});
export const {LoadNewBill,UpdateNewBill,DeleteNewBill,UpdateGhiChuBill} = newBillSlice.actions;
export default newBillSlice.reducer;
export const GetNewBill = (state) => state.newBill