import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppConfig } from "./AppConfig";
import { ToastContainer } from "react-toastify";
import NotFoud from "../pages/404/NotFoud";
import NotAccess from "../pages/403/NotAccess";
import "react-toastify/dist/ReactToastify.css";
import GuestGuard from "../guard/GuestGuard";
import AdminGuard from "../guard/AdminGuard";
import { Suspense } from "react";
import DashboardAdmin from "../layouts/admin/DashboardAdmin";
// khách hàng
import KhachHang from "../layouts/admin/khachhang/KhachHang";
import AddKhachHang from "../layouts/admin/khachhang/AddKhachHang";
import UpdateKhachHang from "../layouts/admin/khachhang/UpdateKhachHang";
// nhân viên
import NhanVien from "../layouts/admin/nhanvien/NhanVien";
import AddNhanVien from "../layouts/admin/nhanvien/AddNhanVien";
import UpdateNhanVien from "../layouts/admin/nhanvien/UpdateNhanVien";
// Auth
import { Login } from "../layouts/login/Login";
// import { QuenMatKhau } from "../layouts/login/QuenMatKhau";
// import { DangKy } from "../layouts/login/DangKy";
// import ThongKe from "../layouts/admin/thongke/ThongKe";
// import HoaDonDetail from "../layouts/admin/hoadon/HoaDonDetail";
// import DoiMatKhau from "../layouts/admin/doimatkhau/DoiMatKhau";
// thuộc tính sản phẩm
import CTSP from "../layouts/admin/sanpham/CTSP";
import AddSanPham from "../layouts/admin/sanpham/AddSanPham";
import ChatLieu from "../layouts/admin/sanpham/ChatLieu";
import DanhMuc from "../layouts/admin/sanpham/DanhMuc";
import DeGiay from "../layouts/admin/sanpham/DeGiay";
import KichThuoc from "../layouts/admin/sanpham/KichThuoc";
import MauSac from "../layouts/admin/sanpham/MauSac";
import Hang from "../layouts/admin/sanpham/Hang";
import SanPham from "../layouts/admin/sanpham/SanPham";
import HoaDon from "../layouts/admin/hoadon/HoaDon";
import HoaDonDetail from "../layouts/admin/hoadon/HoaDonDetail";
// đợt giảm giá 
import DotGiamGia from "../layouts/admin/dotgiamgia/DotGiamGia";
import ThemDotGiamGia from "../layouts/admin/dotgiamgia/ThemDotGiamGia";
import { Home } from "../layouts/client/home/home";
import { DashboardClient } from "../layouts/client/DashboardClient";
import { CartProvider } from "../layouts/client/cart/CartContext";
import { TimKiem } from "../layouts/client/home/TimKiem";

function App() {
  return (
    <BrowserRouter basename={AppConfig.routerBase}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // nếu nghi ngờ bị phủ, tăng z-index lên thật cao:
        style={{ zIndex: 999999 }}
      />
      <Suspense fallback={null}>
        <Routes>
          {/* commons */}
          <Route path="*" element={<NotFoud />} />
          <Route path="/not-access" element={<NotAccess />} />

          {/* auth */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route
            path="/dang-ky"
            element={<GuestGuard>{/* <DangKy /> */}</GuestGuard>}
          />
          <Route
            path="/quen-mat-khau"
            element={<GuestGuard>{/* <QuenMatKhau /> */}</GuestGuard>}
          />
          <Route
            path="/home"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashboardClient>
                    <Home />
                  </DashboardClient>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/tim-kiem"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashboardClient>
                    <TimKiem />
                  </DashboardClient>
                </CartProvider>
              </GuestGuard>
            }
          />
          {/* client */}

          {/* <Route
            path="/san-pham"
            element={
              <GuestGuard>
                <DashboardClient>
                  <SanPhamClient />
                </DashboardClient>
              </GuestGuard>
            }
          />
          <Route
            path="/gio-hang"
            element={
              <GuestGuard>
                <DashboardClient>
                  <GioHang />
                </DashboardClient>
              </GuestGuard>
            }
          />
          <Route
            path="/lien-he"
            element={
              <GuestGuard>
                <DashboardClient>
                  <LienHe />
                </DashboardClient>
              </GuestGuard>
            }
          />
          <Route
            path="/tim-kiem/:ten"
            element={
              <GuestGuard>
                <DashboardClient>
                  <TimKiemDashBoard />
                </DashboardClient>
              </GuestGuard>
            }
          />

          {/* admin */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <DashboardAdmin />
              </AdminGuard>
            }
          />
          <Route
            path="/admin-khach-hang"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <KhachHang />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-them-khach-hang"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <AddKhachHang />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-update-khach-hang/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <UpdateKhachHang />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-nhan-vien"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <NhanVien />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-them-nhan-vien"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <AddNhanVien />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-update-nhan-vien/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <UpdateNhanVien />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-chat-lieu"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <ChatLieu />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-danh-muc"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <DanhMuc />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-de-giay"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <DeGiay />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-kich-thuoc"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <KichThuoc />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-mau-sac"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <MauSac />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-hang"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <Hang />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-san-pham"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <SanPham />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-hoa-don"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <HoaDon />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-detail-hoa-don/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <HoaDonDetail />
                </DashboardAdmin>
              </AdminGuard>
            }
          />

          <Route
            path="/admin-them-san-pham"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <AddSanPham />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-showct/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <CTSP />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-dot-giam-gia"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <DotGiamGia />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-them-dot-giam-gia"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <ThemDotGiamGia />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          {/* <Route
            path="/admin-doi-mat-khau"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <DoiMatKhau />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
    
  
  

   
   
   
          <Route
            path="/admin-gioi-tinh"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <GioiTinh />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
     
   
     
          <Route
            path="/admin-chi-tiet-san-pham/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <ChiTietSanPham />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-them-chi-tiet-san-pham/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <AddChiTietSanPham />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-update-chi-tiet-san-pham/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <UpdateChiTietSanPham />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
  
          <Route
            path="/admin-detail-hoa-don/:id"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <HoaDonDetail />
                </DashboardAdmin>
              </AdminGuard>
            }
          />
          <Route
            path="/admin-thong-ke"
            element={
              <AdminGuard>
                <DashboardAdmin>
                  <ThongKe />
                </DashboardAdmin>
              </AdminGuard>
            }
          /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
