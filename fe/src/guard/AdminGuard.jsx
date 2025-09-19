import React from "react";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem("userData"));
  } catch {
    userData = null;
  }

  if (!userData || userData.chucVu !== "NHANVIEN") {
    // Chuyển hướng kèm state báo lỗi
    return (
      <Navigate
        to="/home"
        replace
        state={{ fromGuardError: "Bạn không có quyền truy cập trang này!" }}
      />
    );
  }

  return children;
};

export default AdminGuard;
