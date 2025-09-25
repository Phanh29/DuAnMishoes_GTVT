import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const returnBillSilde = createSlice({
    name:"returnBill",
    initialState,
    reducers:{
        LoadReturnBill: (state , action) => {
            const data = action.payload;
            // const index = state.findIndex((item) => item.key === data.key);
            // if (index === -1){
                const newRetunBill = {
                    stt: state.length+1,
                    key: data.key,
                    idCTSP:data.idCTSP,
                    tenSP: data.tenSP,
                    idHD:data.idHD,
                    soLuong: data.soLuong,
                    donGia: data.donGia,
                    soLuongHienTai: 1,
                    tenMS:data.tenMS,
                    tenKT:data.tenKT,
                    idHDCT:data.idHDCT,
                    giaTriKhuyenMai: data.giaTriKhuyenMai,
                    giaGiam:data.giaGiam,
                    disabled: data.giaTriKhuyenMai !== null,
               }
            
                state.unshift(newRetunBill);
                state.forEach((item,index) => {
                    item.stt = index + 1;
                });
           // }
        },
        UpdateReturnBill: (state,action) => {
            const data = action.payload;
            const index = state.findIndex((item) => item.key === data.key);
            if (index !== -1){
              state[index].soLuongHienTai = data.soLuongHienTai;
            }
        },
        ReloadReturnBill : (state,action) =>{
            return initialState;
        }
    }
});
export const {LoadReturnBill,UpdateReturnBill,DeleteAll,ReloadReturnBill} =  returnBillSilde.actions;
export default returnBillSilde.reducer;
export const GetReturnBill = (state) => state.returnBill