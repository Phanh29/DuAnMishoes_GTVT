import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const productSlice=createSlice({
    name:"product",
    initialState, 
    reducers: {
        SetProduct: (state,action) =>{
            return action.payload;
        },
        AddProduct: (state,action)=>{
            const data = action.payload ;
            const index = state.findIndex((item)=> item.id === data.id);
            if (index === -1){
                const newProduct ={
                stt: state.length +1,
                id: data.id,
                soLuong: data.soLuong,
                linkAnh: data.linkAnh,
                tenSP : data.tenSP,
                tenKT : data.tenKT,
                tenMS : data.tenMS,
                maMS : data.maMS,
                giaBan : data.giaBan,
                giaNhap: data.giaNhap, 
                gioiTinh : data.gioiTinh,
                trangThai : data.trangThai,
                chatLieu : data.chatLieu,
                danhMuc : data.danhMuc,
                deGiay: data.deGiay,
                ghiChu : data.ghiChu,
                hoaDon : data.hoaDon,
                tenKM : data.tenKM,
                chiTietSanPham : data.chiTietSanPham,
                nguoiTao: data.nguoiTao,
                nguoiSua : data.nguoiSua,
                ngayTao : data.ngayTao,
                ngaySua : data.ngaySua,
                moTa : data.moTa,
                qrCode : data.qrCode,
                sanPham : data.sanPham,
                loaiKM : data.loaiKM,
                giaTriKhuyenMai : data.giaTriKhuyenMai,
                giaGiam : (data.tenKM !== null) ?(data.loaiKM === 'Tiền mặt' ? data.giaTriKhuyenMai :  (data.giaBan * data.giaTriKhuyenMai / 100)) : 0,
                giaSauGiam : data.giaBan - ((data.tenKM !== null) ?(data.loaiKM === 'Tiền mặt' ? data.giaTriKhuyenMai :  (data.giaBan * data.giaTriKhuyenMai / 100)) : 0 )
                }
            
                state.unshift(newProduct);
                state.forEach((item, index) => {
                    item.stt = index + 1;
                });
            } else {
                state[index].id = data.id;
                state[index].soLuong = data.soLuong;
                state[index].linkAnh = data.linkAnh;
                state[index].tenSP = data.tenSP;
                state[index].tenKT = data.tenKT;
                state[index].tenMS = data.tenMS;
                state[index].maMS = data.maMS;
                state[index].giaBan = data.giaBan;
                state[index].giaNhap = data.giaNhap; 
                state[index].gioiTinh = data.gioiTinh;
                state[index].trangThai = data.trangThai;
                state[index].chatLieu = data.chatLieu;
                state[index].danhMuc = data.danhMuc;
                state[index].deGiay = data.deGiay;
                state[index].ghiChu = data.ghiChu;
                state[index].hoaDon = data.hoaDon;
                state[index].tenKM = data.tenKM;
                state[index].chiTietSanPham = data.chiTietSanPham;
                state[index].nguoiTao = data.nguoiTao;
                state[index].nguoiSua = data.nguoiSua;
                state[index].ngayTao = data.ngayTao;
                state[index].ngaySua = data.ngaySua;
                state[index].moTa = data.moTa;
                state[index].qrCode = data.qrCode;
                state[index].sanPham = data.sanPham;
                state[index].loaiKM = data.loaiKM;
                state[index].giaTriKhuyenMai = data.giaTriKhuyenMai;
                state[index].giaGiam = (data.tenKM !== null) ?(data.loaiKM === 'Tiền mặt' ? data.giaTriKhuyenMai :  (data.giaBan * data.giaTriKhuyenMai / 100)) : 0;
                state[index].giaSauGiam = data.giaBan - ((data.tenKM !== null) ?(data.loaiKM === 'Tiền mặt' ? data.giaTriKhuyenMai :  (data.giaBan * data.giaTriKhuyenMai / 100)) : 0 )
            }
            
            },

     
        UpdatePushProduct:(state,action)=>{
            const updateProduct = action.payload;
            const index = state.findIndex((i) => i.id === updateProduct.id); 
            if (index !== -1){               
                state[index].soLuong = state[index].soLuong + updateProduct.soLuong;
            }
        },
        RemoveProduct : (state,action) =>{
            return state.filter((item) => item.id !== action.payload.id)
        },
        UpdateApartProduct : (state,action)=>{
            const updateProduct = action.payload;
            const index = state.findIndex((i) => i.id === updateProduct.id); 
            if (index !== -1){               
                state[index].soLuong = state[index].soLuong - updateProduct.soLuong;
            }
        } ,
        GetQuantityProduct : (state,action)=>{
            const data = action.payload;
            const index = state.findIndex((i) => i.id === data.id);             
                return state[index].soLuong ;
         
        }
    }

});
export const {AddProduct,RemoveProduct,UpdatePushProduct,UpdateApartProduct,GetQuantityProduct} = productSlice.actions;
export default productSlice.reducer;
 export const GetProduct = (state) => state.product;
