import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginImage from "../../assets/images/logo1.png";
import bannerLogin from "../../assets/images/bannerLogin.png";
import { LoginAPI } from "../../pages/api/login/LoginAPI";
import ReCAPTCHA from "react-google-recaptcha";

export const QuenMatKhau = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [capVal, setCapVal] = useState(null);
  const [listNguoiDung, setListNguoiDung] = useState([]);

  useEffect(() => {
    LoginAPI.getAll()
      .then((res) => setListNguoiDung(res.data))
      .catch(() => {
        toast.error("Không thể tải danh sách người dùng!");
      });
  }, []);

  const checkTrungEmail = (email) =>
    listNguoiDung.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

const forgotPass = async () => {
  try {
    const values = await form.validateFields();

    if (!checkTrungEmail(values.email)) {
      toast.error("Email không tồn tại!");
      return;
    }

    await toast.promise(LoginAPI.forgotPass(values), {
      pending: "Đang gửi yêu cầu...",
      success: "Đổi mật khẩu thành công 👌",
      error: "Có lỗi xảy ra 😥",
    });

    // chuyển trang sau 1s để toast kịp render
    setTimeout(() => nav("/login"), 1000);
  } catch (err) {
    toast.error("Vui lòng kiểm tra lại thông tin!");
  }
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
          {/* Banner */}
          <div className="col-md-6 p-0 overflow-hidden">
            <img
              src={bannerLogin}
              alt="banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Form */}
          <div className="col-md-6 d-flex flex-column">
            <img
              className="d-block mx-auto mb-5"
              width={350}
              src={loginImage}
              alt="logo"
              style={{ marginTop: 190 }}
            />
            <Form
              form={form}
              onFinish={forgotPass}
              layout="vertical"
              className="d-block mx-auto"
            >
              <Form.Item
                className="mb-1 ms-5 align-center"
                name="email"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập email." },
                  { type: "email", message: "Email không hợp lệ." },
                ]}
                labelCol={{ span: 20 }}
                wrapperCol={{ span: 20 }}
              >
                <Input
                  placeholder="Mời nhập Email"
                  style={{ width: 365, height: 40 }}
                />
              </Form.Item>

              <ReCAPTCHA
                sitekey="6Le0Y34pAAAAAEdCIL62wVWfz93Mva93f99ffiCL"
                onChange={(val) => setCapVal(val)}
                className="mt-3 d-flex justify-content-center"
              />

              <div className="d-flex justify-content-center">
                <Button
                  className="mb-1 w-50 mt-4"
                  type="primary"
                  htmlType="submit"
                  disabled={!capVal}
                >
                  Send
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
