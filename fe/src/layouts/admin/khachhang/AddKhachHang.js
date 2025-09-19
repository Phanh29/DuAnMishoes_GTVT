
import "./khachhang.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Form, Input, Row, Select } from "antd";
import { FaMoneyBills } from "react-icons/fa6";
import UpLoadImage from "../../uploadAnh/UpLoadImage";
import { AddressApi } from "../../../pages/api/address/AddressApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";
// helpers
const safe = (v) => (v == null ? "" : String(v));
const sTrim = (v) => safe(v).trim();

export default function AddKhachHang() {
  const [form] = Form.useForm();
  const nav = useNavigate();

  // Địa chỉ
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  const [imageUrl, setImageUrl] = useState("");

  // Danh sách KH để check trùng
  const [listKhachHang, setListKhachHang] = useState([]);

  useEffect(() => {
    AddressApi.fetchAllProvince().then((res) => {
      setListProvince(res?.data?.data ?? []);
    });
    NguoiDungAPI.getAll("khach-hang").then((res) => {
      setListKhachHang(res?.data ?? []);
    });
  }, []);

  const handleFileUpload = (cloudinaryUrl) => setImageUrl(cloudinaryUrl);

  const handleProvinceChange = (value) => {
    try {
      const provinceObj = JSON.parse(value);
      setProvince(provinceObj);
      form.setFieldsValue({ tenThanhPho: provinceObj.ProvinceName });

      AddressApi.fetchAllProvinceDistricts(provinceObj.ProvinceID).then((res) =>
        setListDistricts(res?.data?.data ?? [])
      );

      // reset cấp dưới
      setDistrict(null);
      setWard(null);
      setListWard([]);
      form.setFieldsValue({ tenHuyen: undefined, tenXa: undefined });
    } catch {}
  };

  const handleDistrictChange = (value) => {
    try {
      const districtObj = JSON.parse(value);
      setDistrict(districtObj);
      form.setFieldsValue({ tenHuyen: districtObj.DistrictName });

      AddressApi.fetchAllProvinceWard(districtObj.DistrictID).then((res) =>
        setListWard(res?.data?.data ?? [])
      );

      // reset xã
      setWard(null);
      form.setFieldsValue({ tenXa: undefined });
    } catch {}
  };

  const handleWardChange = (value) => {
    try {
      const wardObj = JSON.parse(value);
      setWard(wardObj);
      form.setFieldsValue({ tenXa: wardObj.WardName });
    } catch {}
  };

  // Submit form
  const handleFinish = (values) => {
    // Kiểm tra tuổi (>= 18)
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

    // Kiểm tra trùng
    if (
      listKhachHang.some(
        (nv) =>
          sTrim(nv.email).toLowerCase() === sTrim(values.email).toLowerCase()
      )
    ) {
      toast.error("🦄 Email đã tồn tại!");
      return;
    }

    if (
      listKhachHang.some(
        (nv) => sTrim(nv.soDienThoai) === sTrim(values.soDienThoai)
      )
    ) {
      toast.error("🦄 Số điện thoại đã tồn tại!");
      return;
    }

    if (
      listKhachHang.some(
        (nv) => sTrim(nv.canCuocCongDan) === sTrim(values.canCuocCongDan)
      )
    ) {
      toast.error("🦄 Căn cước đã tồn tại!");
      return;
    }

    // Payload
    const data = {
      ...values,
      anh:
        imageUrl ||
        "https://res.cloudinary.com/dm0w2qws8/image/upload/v1707054561/pryndkawgsxymspxkxcm.png",
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
    formData.append("file", null);

    NguoiDungAPI.create("khach-hang", formData)
      .then(() => {
        toast.success("🦄 Thêm khách hàng thành công!");
        nav("/admin-khach-hang");
      })
      .catch((err) => {
        console.error(err);
        toast.error("🦄 Thêm khách hàng thất bại!");
      });
  };

  const back = () => nav("/admin-khach-hang");

  return (
    <>
      <Divider orientation="center">
        <h3 className="text-first fw-bold">
          <FaMoneyBills /> Thêm khách hàng
        </h3>
      </Divider>

      <Form
        form={form}
        layout="vertical"
        className="mt-5"
        onFinish={handleFinish}
        initialValues={{
          ten: "",
          email: "",
          soDienThoai: "",
          canCuocCongDan: "",
          gioiTinh: undefined,
          ngaySinh: undefined,
          tenThanhPho: undefined,
          tenHuyen: undefined,
          tenXa: undefined,
          diaChi: "",
        }}
      >
        <Row gutter={14}>
          <Col span={7}>
            <Card style={{ height: "100%", minHeight: "550px" }}>
              <h5 className="text-center fw-bold">Ảnh đại diện</h5>
              <Row justify="center" className="mt-5">
                <UpLoadImage onFileUpload={handleFileUpload} />
              </Row>
            </Card>
          </Col>

          <Col span={17}>
            <Card>
              <h5 className="text-center fw-bold">Thông tin khách hàng</h5>

              <Row justify="end" style={{ marginBottom: 15, marginTop: 10 }}>
                <Col>
                  <Button htmlType="submit" className="btn3">
                    Hoàn tất
                  </Button>
                  <Button
                    onClick={back}
                    className="btn3"
                    style={{ marginLeft: 8 }}
                  >
                    Hủy
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col span={11} style={{ marginRight: 20 }}>
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
                    <Input className="text-center" />
                  </Form.Item>

                  <Form.Item
                    name="canCuocCongDan"
                    label="Căn cước"
                    rules={[
                      { required: true, message: "Hãy nhập căn cước." },
                      { pattern: /^\d{12}$/, message: "Phải 12 số." },
                    ]}
                  >
                    <Input className="text-center" />
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
                    name="tenThanhPho"
                    label="Tỉnh/Thành phố"
                    rules={[{ required: true, message: "Hãy chọn Tỉnh/TP." }]}
                  >
                    <Select
                      onChange={handleProvinceChange}
                      placeholder="-- Chọn Tỉnh/TP --"
                    >
                      {listProvince.map((item) => (
                        <Select.Option
                          key={item.ProvinceID}
                          value={JSON.stringify(item)}
                        >
                          {item.ProvinceName}
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
                      onChange={handleWardChange}
                      placeholder="-- Chọn Xã/Phường --"
                      disabled={!listWard.length}
                    >
                      {listWard.map((item) => (
                        <Select.Option
                          key={item.WardCode}
                          value={JSON.stringify(item)}
                        >
                          {item.WardName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={11}>
                  <Form.Item
                    name="ngaySinh"
                    label="Ngày sinh"
                    rules={[{ required: true, message: "Hãy nhập ngày sinh." }]}
                  >
                    <Input type="date" className="text-center" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Hãy nhập email." },
                      { type: "email", message: "Email không hợp lệ." },
                    ]}
                  >
                    <Input className="text-center" />
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
                    <Input className="text-center" />
                  </Form.Item>

                  <Form.Item
                    name="tenHuyen"
                    label="Quận/Huyện"
                    rules={[{ required: true, message: "Chọn Quận/Huyện." }]}
                  >
                    <Select
                      onChange={handleDistrictChange}
                      placeholder="-- Chọn Quận/Huyện --"
                      disabled={!listDistricts.length}
                    >
                      {listDistricts.map((item) => (
                        <Select.Option
                          key={item.DistrictID}
                          value={JSON.stringify(item)}
                        >
                          {item.DistrictName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="diaChi"
                    label="Số nhà"
                    rules={[{ required: true, message: "Hãy nhập số nhà." }]}
                  >
                    <Input className="text-center" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      <ToastContainer />
    </>
  );
}
