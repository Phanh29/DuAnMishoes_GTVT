import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import loginImage from "../../assets/images/logo1.png";
import bannerLogin from "../../assets/images/bannerLogin.png";
import { LoginAPI } from "../../pages/api/login/LoginAPI";
import { AddressApi } from "../../pages/api/address/AddressApi";

// helpers
const safe = (v) => (v == null ? "" : String(v));
const sTrim = (v) => safe(v).trim();
export const DangKy = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  // lists địa chỉ
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  // người dùng để check trùng email
  const [listNguoiDung, setListNguoiDung] = useState([]);

  useEffect(() => {
    // load người dùng
    LoginAPI.getAll()
      .then((res) => setListNguoiDung(res.data || []))
      .catch(() => toast.error("Không thể tải danh sách người dùng!"));

    // load tỉnh/thành
    AddressApi.fetchAllProvince()
      .then((res) => setListProvince(res?.data?.data ?? []))
      .catch(() => {});
  }, []);

 const handleProvinceChange = (value) => {
   try {
     const provinceObj = JSON.parse(value);
     setProvince(provinceObj); // ✅ thêm
     form.setFieldsValue({
       tenThanhPho: provinceObj.ProvinceName,
       tenHuyen: undefined,
       tenXa: undefined,
     });

     AddressApi.fetchAllProvinceDistricts(provinceObj.ProvinceID).then((res) =>
       setListDistricts(res?.data?.data ?? [])
     );

     setDistrict(null);
     setWard(null);
     setListWard([]);
   } catch {}
 };

 const handleDistrictChange = (value) => {
   try {
     const districtObj = JSON.parse(value);
     setDistrict(districtObj); // ✅ thêm
     form.setFieldsValue({
       tenHuyen: districtObj.DistrictName,
       tenXa: undefined,
     });

     AddressApi.fetchAllProvinceWard(districtObj.DistrictID).then((res) =>
       setListWard(res?.data?.data ?? [])
     );
     setWard(null);
   } catch {}
 };

 const handleWardChange = (value) => {
   try {
     const wardObj = JSON.parse(value);
     setWard(wardObj); // ✅ thêm
     form.setFieldsValue({ tenXa: wardObj.WardName });
   } catch {}
 };

const signUp = async (values) => {
  console.log("SUBMIT VALUES:", values); // <- sẽ thấy log ngay khi submit pass

  // kiểm tra tuổi
  const birthDate = values.ngaySinh ? new Date(values.ngaySinh) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime())) {
    toast.error("🦄 Ngày sinh không hợp lệ!");
    return;
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  )
    age--;
  if (age < 18) {
    toast.error("🦄 Khách hàng chưa đủ 18 tuổi!");
    return;
  }

  // kiểm tra trùng
  if (
    listNguoiDung.some(
      (nv) =>
        sTrim(nv.email).toLowerCase() === sTrim(values.email).toLowerCase()
    )
  ) {
    toast.error("🦄 Email đã tồn tại!");
    return;
  }
  if (
    listNguoiDung.some(
      (nv) => sTrim(nv.soDienThoai) === sTrim(values.soDienThoai)
    )
  ) {
    toast.error("🦄 Số điện thoại đã tồn tại!");
    return;
  }
  if (
    listNguoiDung.some(
      (nv) => sTrim(nv.canCuocCongDan) === sTrim(values.canCuocCongDan)
    )
  ) {
    toast.error("🦄 Căn cước đã tồn tại!");
    return;
  }
  if (values.matKhau !== values.pass) {
    toast.error("Xác nhận mật khẩu không khớp!");
    return;
  }

  // build payload
  const data = {
    ...values,
    ngaySinh: values.ngaySinh ? new Date(values.ngaySinh).getTime() : null,
    idThanhPho: province?.ProvinceID ?? null,
    idHuyen: district?.DistrictID ?? null,
    idXa: ward?.WardCode ?? null,
    tenThanhPho: province?.ProvinceName ?? undefined,
    tenHuyen: district?.DistrictName ?? undefined,
    tenXa: ward?.WardName ?? undefined,
  };
  const formData = new FormData();
  formData.append("request", JSON.stringify(data));
  console.log("FORM DATA BUILT:", data); // <- log chắc chắn thấy

  await LoginAPI.signUp(formData);
  toast.success("Đăng ký thành công!");
  setTimeout(() => nav("/login"), 800);
};

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="overflow-hidden" style={{ width: 1300, height: 700 }}>
        <div className="row h-100">
          {/* Banner */}
          <div className="col-md-6 p-0 overflow-hidden">
            <img
              src={bannerLogin}
              alt="banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Form */}
          <div className="col-md-6 d-flex flex-column p-4">
            <img src={loginImage} alt="logo" width={300} className="mx-auto" />

            {/* ✅ FORM BAO NGOÀI TẤT CẢ CÁC ITEM */}
            <Form form={form} layout="vertical" onFinish={signUp}>
              <Row gutter={16}>
                {/* Cột trái */}
                <Col span={12}>
                  <Form.Item
                    name="ten"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Hãy nhập họ tên." },
                      {
                        pattern: /^[A-Za-zÀ-ỹ\s]+$/,
                        message: "Chỉ chứa chữ cái.",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="canCuocCongDan"
                    label="Căn cước"
                    rules={[
                      { required: true, message: "Hãy nhập căn cước." },
                      { pattern: /^\d{12}$/, message: "Phải 12 số." },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="gioiTinh"
                    label="Giới tính"
                    rules={[{ required: true, message: "Chọn giới tính." }]}
                  >
                    <Select placeholder="--Chọn giới tính--">
                      <Select.Option value="true">Nam</Select.Option>
                      <Select.Option value="false">Nữ</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="matKhau"
                    label="Mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng không để trống mật khẩu!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Mời nhập Password"
                      iconRender={(visible) =>
                        visible ? <IoEyeOffOutline /> : <IoEyeOutline />
                      }
                      visibilityToggle={{
                        visible: showPassword,
                        onVisibleChange: togglePasswordVisibility,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tenThanhPho"
                    label="Tỉnh/Thành phố"
                    rules={[{ required: true, message: "Hãy chọn Tỉnh/TP." }]}
                  >
                    <Select
                      placeholder="-- Chọn Tỉnh/TP --"
                      onChange={handleProvinceChange}
                    >
                      {listProvince.map((p) => (
                        <Select.Option
                          key={p.ProvinceID}
                          value={JSON.stringify(p)}
                        >
                          {p.ProvinceName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="tenXa"
                    label="Xã/Phường"
                    rules={[{ required: true, message: "Chọn Xã/Phường." }]}
                  >
                    <Select
                      placeholder="-- Chọn Xã/Phường --"
                      onChange={handleWardChange}
                      disabled={!listWard.length}
                    >
                      {listWard.map((w) => (
                        <Select.Option
                          key={w.WardCode}
                          value={JSON.stringify(w)}
                        >
                          {w.WardName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Cột phải */}
                <Col span={12}>
                  <Form.Item
                    name="ngaySinh"
                    label="Ngày sinh"
                    rules={[{ required: true, message: "Hãy nhập ngày sinh." }]}
                  >
                    <Input type="date" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Hãy nhập email." },
                      { type: "email", message: "Email không hợp lệ." },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="soDienThoai"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: "Hãy nhập SDT." },
                      {
                        pattern: /^0\d{9}$/,
                        message: "SDT phải 10 số và bắt đầu bằng 0.",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="pass"
                    label="Nhập lại mật khẩu"
                    dependencies={["matKhau"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("matKhau") === value)
                            return Promise.resolve();
                          return Promise.reject(
                            new Error("Mật khẩu nhập lại không khớp!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Mời nhập lại Password"
                      iconRender={(visible) =>
                        visible ? <IoEyeOffOutline /> : <IoEyeOutline />
                      }
                      visibilityToggle={{
                        visible: showPassword,
                        onVisibleChange: togglePasswordVisibility,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tenHuyen"
                    label="Quận/Huyện"
                    rules={[{ required: true, message: "Chọn Quận/Huyện." }]}
                  >
                    <Select
                      placeholder="-- Chọn Quận/Huyện --"
                      onChange={handleDistrictChange}
                      disabled={!listDistricts.length}
                    >
                      {listDistricts.map((d) => (
                        <Select.Option
                          key={d.DistrictID}
                          value={JSON.stringify(d)}
                        >
                          {d.DistrictName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="diaChi"
                    label="Số nhà"
                    rules={[{ required: true, message: "Hãy nhập số nhà." }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <div className="d-flex justify-content-center mt-2">
                <Button type="primary" htmlType="submit" className="px-5">
                  Hoàn tất
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
