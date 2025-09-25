import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const paySlice = createSlice({
  name: "pay",
  initialState,
  reducers: {
    SetPay: (state, action) => {
      return action.payload;
    },
    AddPay: (state, action) => {
      const data = action.payload;
      const index = state.findIndex((item) => item.hoaDon === data.hoaDon);
      if (index !== -1) 
      {
        if (state[index].phươngThuc !== data.phuongThuc){
          state[index].phuongThuc = 2
          state[index].tienMat = parseFloat(!state[index].tienMat ? 0 : state[index].tienMat) + parseFloat(!data.tienMat ? 0 : data.tienMat)
          state[index].chuyenKhoan = parseFloat(!state[index].chuyenKhoan ? 0 : state[index].chuyenKhoan) + parseFloat(!data.chuyenKhoan ? 0 : data.chuyenKhoan)  
          state[index].tongTien = parseFloat(state[index].tongTien) + parseFloat(!data.tienMat ? 0 : data.tienMat) +  parseFloat(!data.chuyenKhoan ? 0 : data.chuyenKhoan)
        }
      }else {
        const newPay = {
          stt: state.length + 1,
         // id: data.id,
          hoaDon: data.hoaDon,
          phuongThuc: data.phuongThuc,
          tienMat: !data.tienMat ? 0 : data.tienMat,
          chuyenKhoan: !data.chuyenKhoan ? 0 : data.chuyenKhoan,
          tongTien: parseFloat(!data.tienMat ? 0 : data.tienMat) + parseFloat(!data.chuyenKhoan ? 0 : data.chuyenKhoan),
          phuongThucVNP: !data.phuongThucVNP ? null : data.phuongThucVNP,
          moTa: data.moTa,
          ngayTao: data.ngayTao,
          ngaySua: data.ngaySua,
          nguoiTao: data.nguoiTao,
          nguoiSua: data.nguoiSua,
          trangThai: data.trangThai,
        };
        state.unshift(newPay);
        state.forEach((item, index) => {
          item.stt = index + 1;
        });
      }
    },
    DeletePay:(state,action) => {
      return initialState;
    }
  },
});
export const {AddPay,DeletePay} = paySlice.actions;
export default paySlice.reducer;
export const GetPay = (state) => state.pay;