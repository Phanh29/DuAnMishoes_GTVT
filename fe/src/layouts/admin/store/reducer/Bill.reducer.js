import { createSlice } from "@reduxjs/toolkit";


const initialState = [];
const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    SetBill: (state, action) => {
      return action.payload;
    },
    CreateBill: (state, action) => {
      const data = action.payload;
      const index = state.findIndex((period) => period.key === data.key);
      if (index !== -1) return;
      const newBill = {
        stt: state.length + 1,
       // id: data.id,
        ma: data.ma,
        trangThai: 0,
        key: data.key,
        tenNguoiDung: data.tenNguoiDung,
        // ngayTao : data.ngayTao,
        loaiHoaDon: 1,
        nhanVien: data.nhanVien,
        nguoiDung: data.nguoiDung,
        voucher: data.voucher,
        ngayMua: data.ngayMua,
        giaGoc: data.giaGoc,
        giaGiamGia: data.giaGiamGia,
        thanhTien: data.thanhTien,
        diemSuDung: null,
        giaTriDiem: data.giaTriDiem,
        tenNguoiNhan: data.tenNguoiNhan,
        soDienThoai: data.soDienThoai,
        diaChi: data.diaChi,
        qrCode: data.qrCode,
        ghiChu: data.ghiChu,
        ngayDuKienNhan: data.ngayDuKienNhan,
        ngayNhan: data.ngayNhan,
        ngayTraHang: data.ngayTraHang,
        nguoiTao: data.nguoiTao,
        //  nguoiSua: data.nguoiSua,
        //  ngaySua: data.ngaySua,
        gtNguoiDung: null,
        email: data.email,
        idHuyen : data.idHuyen,
        idXa : data.idXa,
        idThanhPho: data.idThanhPho,
        diemNguoiDung: null,
        tienVanChuyen: data.tienVanChuyen,
      };
      state.unshift(newBill);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateBill: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].ngaySua = updatedBill.ngaySua;
        state[index].ngayThanhToan = updatedBill.ngayThanhToan;
        state[index].voucher = updatedBill.voucher;
        state[index].ngayMua = updatedBill.ngayMua;
        state[index].giaGoc = updatedBill.giaGoc;
        state[index].giaGiam = updatedBill.giaGiam;
        state[index].thanhTien =
          parseFloat(!updatedBill.giaGoc ? 0 : updatedBill.giaGoc) -
          parseFloat(!updatedBill.giaGiamGiam ? 0 : updatedBill.giaGiam);
        state[index].diemSuDung = updatedBill.diemSuDung;
        state[index].giaTriDiem = updatedBill.giaTriDiem;
      }
    },
    RemoveBill: (state, action) => {
      return state.filter((item) => item.key !== action.payload.key);
    },
    GetBillByKey: (state, action) => {
      const data = action.payload;
      const index = state.findIndex((period) => period.key === data.activeKey);
      return state[index];
    },
    UpdateKHToBill: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].nguoiDung = updatedBill.nguoiDung;
        state[index].tenNguoiDung = updatedBill.tenNguoiDung;
        state[index].gtNguoiDung = updatedBill.gtNguoiDung;
        state[index].diemNguoiDung = updatedBill.diemNguoiDung;
        state[index].idHuyen = updatedBill.idHuyen;
        state[index].idXa = updatedBill.idXa;
        state[index].idThanhPho = updatedBill.idThanhPho;
      }
    },

    UpdateVoucherToBill: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].voucher = updatedBill.voucher;
      }
    },
    UpdateNullClient: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].nguoiDung = null;
        state[index].tenNguoiDung = null;
        state[index].gtNguoiDung = null;
        state[index].diemNguoiDung = null;
      }
    },
    UpdateNullVoucher: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].voucher = null;
      }
    },
    UpdateVanChuyenToBill: (state, action) => {
      const updatedBill = action.payload; // backend
      const index = state.findIndex((period) => period.key === updatedBill.key);
      if (index !== -1) {
        state[index].tenNguoiNhan = updatedBill.tenNguoiNhan;
        state[index].email = updatedBill.email;
        state[index].soDienThoai = updatedBill.soDienThoai;
        state[index].tienVanChuyen = updatedBill.tienVanChuyen;
        state[index].ngayDuKienNhan = updatedBill.ngayDuKienNhan;
        state[index].diaChi = updatedBill.diaChi;
        state[index].idThanhPho = updatedBill.idThanhPho;
        state[index].idHuyen = updatedBill.idHuyen;
        state[index].idXa = updatedBill.idXa;

      }
    },
  DeleteVanChuyenFromBill: (state, action) => {
    const updatedBill = action.payload; // backend
    const index = state.findIndex((period) => period.key === updatedBill.key);
    if (index !== -1) {
      state[index].tenNguoiNhan = "";
      state[index].email = "";
      state[index].soDienThoai = "";
      state[index].tienVanChuyen = "";
      state[index].ngayDuKienNhan = "";
      state[index].diaChi = "";
      state[index].idHuyen = "";
      state[index].idXa = "" ;
      state[index].idThanhPho = "";
    }
  },

  UpdateTienVanChuyen : (state,action) => {
    const updatedBill = action.payload; // backend
    const index = state.findIndex((period) => period.key === updatedBill.key);
    if (index !== -1) {
      state[index].tienVanChuyen = updatedBill.tienVanChuyen;;

    }
  },

  UpdateTienHang : (state,action) => {
    const updatedBill = action.payload; // backend
    const index = state.findIndex((period) => period.key === updatedBill.key);
    if (index !== -1) {
      state[index].thanhTien += updatedBill.thanhTien;
    }
  },

  UpdateTienHangGiam : (state,action) => {
    const updatedBill = action.payload; // backend
    const index = state.findIndex((period) => period.key === updatedBill.key);
    if (index !== -1) {
      state[index].thanhTien -= updatedBill.thanhTien;
    }
  },
  Update : (state,action) => {
    const updatedBill = action.payload; // backend
    const index = state.findIndex((period) => period.key === updatedBill.key);
    if (index !== -1) {
      state[index].thanhTien = updatedBill.thanhTien;
    }
  }
},
},
);

export const {
  Update,
  UpdateTienHang,
  UpdateTienHangGiam,
  SetBill,
  CreateBill,
  UpdateBill,
  RemoveBill,
  GetBillByKey,
  UpdateKHToBill,
  UpdateNullClient,
  UpdateNullVoucher,
  UpdateVoucherToBill,
  UpdateVanChuyenToBill,
  DeleteVanChuyenFromBill,
  UpdateTienVanChuyen
} = billSlice.actions;
export default billSlice.reducer;
export const GetBill = (state) => state.bill;
