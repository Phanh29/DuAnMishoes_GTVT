import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import loginImage from "../../assets/images/logoNgang1.png";
import { LoginAPI } from "../../pages/api/login/LoginAPI";

export const Login = () => {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = (data) => {
    const { email } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === "") {
      toast.warning("Vui lòng nhập email!", { autoClose: 2000 });
      return;
    }
    if (!emailRegex.test(email)) {
      toast.warning("Email không đúng định dạng!", { autoClose: 2000 });
      return;
    }
    if (!password || password.trim() === "") {
      toast.warning("Vui lòng nhập mật khẩu!", { autoClose: 2000 });
      return;
    }

    LoginAPI.login(data)
      .then((response) => {
        // Lưu token accessToken vào localStorage
        localStorage.clear();
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(response.data));
        if (response.data.chucVu === "KHACHHANG") {
          nav("/home");
        } else {
          nav("/admin");
        }
      })
      .catch(() => {
        toast.error("Sai tên đăng nhập hoặc mật khẩu!", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="container-login form-login card overflow-hidden"
        style={{ width: 1300, height: 700 }}
      >
        <div className="row h-100">
          <div className="col-md-6 p-0 overflow-hidden ">
            <img
              src="https://i.pinimg.com/564x/03/08/34/030834f7223ebfd68a5b7a0749b1659e.jpg"
              alt="logo bes"
              style={{
                width: "100%", // rộng bằng col-md-6
                height: "100%", // cao bằng col-md-6
                objectFit: "contain", // giữ nguyên tỷ lệ, không bị cắt
                display: "block",
                margin: "0 auto", // căn giữa theo chiều ngang
              }}
            />
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center   px-4">
            <img
              className="d-block mx-auto mb-5"
              width={350}
              src={loginImage}
              alt="logo"
              style={{ marginTop: "-200px" }}
            />

            <Form
              form={form}
              onFinish={login}
              layout="vertical"
              className="text-center"
            >
              <Form.Item name="email" className="mb-1">
                <Input
                  placeholder="Mời nhập Email"
                  style={{ height: 45, width: 550 }}
                />
              </Form.Item>

              <Form.Item name="password" className="mb-1 mt-3">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    placeholder="Mời nhập Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ height: 45, width: 650, marginLeft: 30 }}
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    style={{
                      marginLeft: 10,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={22} />
                    ) : (
                      <IoEyeOutline size={22} />
                    )}
                  </div>
                </div>
              </Form.Item>

              <div className="text-center mb-3 mt-3">
                <Link to={`/quen-mat-khau`}>
                  <b>Quên mật khẩu?</b>
                </Link>
              </div>

              <Button
                className="mb-2 w-50 text-center"
                style={{ height: 35 }}
                htmlType="submit"
              >
                Đăng nhập
              </Button>
            </Form>

            <div className="divider text-center d-flex align-items-center justify-content-center">
              <Button
                className="mb-2 w-50 text-center"
                style={{ height: 35 }}
                onClick={() => nav("/dang-ky")}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
