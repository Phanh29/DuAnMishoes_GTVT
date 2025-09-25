import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = [];
const payDetailSlice = createSlice({
    name:"payDetail",
    initialState,
    reducers:{
        SetPayDetail:(state,action)=>{
            return action.payload;
        },
        AddPayDetail:(state,action)=>{
            const data = action.payload;
            const index = state.findIndex((item)=> item.hoaDon === data.hoaDon && item.phuongThuc === data.phuongThuc);
            if (index !== -1){
                state[index].soTien = parseFloat(state[index].soTien) + parseFloat(data.soTien);
            }else {
                const newPayDetail = {
                    stt:state.length + 1,
                    hoaDon : data.hoaDon,
                    phuongThuc : data.phuongThuc,
                    soTien : data.soTien
                }
                state.unshift(newPayDetail);
                state.forEach((item,index)=>{
                    item.stt = index +1;
                });
            }
        },
        RemovePayDetail:(state,action) => {
            return state.filter((item) => (item.hoaDon === action.payload.hoaDon && item.phuongThuc !== action.payload.phuongThuc) || (item.hoaDon === action.payload.hoaDon && item.hoaDon !== action.payload.hoaDon));
        },
        DeletePayDetail: (state,action) => {
            return initialState;
        }
    }
})
export const {AddPayDetail,RemovePayDetail,DeletePayDetail} = payDetailSlice.actions;
export default payDetailSlice.reducer;
export const GetPayDetail = (state) => state.payDetail;