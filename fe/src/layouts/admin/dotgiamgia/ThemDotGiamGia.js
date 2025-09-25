// src/pages/admin/dotgiamgia/ThemDotGiamGia.jsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Divider,
  Modal,
  DatePicker,
  Breadcrumb,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { BiSolidDiscount } from "react-icons/bi";
import { LuBadgePercent } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
// ❌ BỎ: import { formatInTimeZone } from "date-fns-tz";
import dayjs from "dayjs";
import { DotGiamGiaAPI } from "../../../pages/api/dotgiamgia/DotGiamGiaAPI";
import TableChiTietSanPham from "./tableChiTietSanPham";
import TableSanPham from "./tableSanPham";

// Chuẩn ISO-8601 cho LocalDateTime (không offset/timezone)
const LDT_FORMAT = "YYYY-MM-DD[T]HH:mm:ss";

const ThemDotGiamGia = () => {
  const navigate = useNavigate();
  const [formThemKhuyenMai] = Form.useForm();

  const [selectedIDSP, setSelectedIDSP] = useState([]); // idSP[]
  const [selectedIDCTSP, setSelectedIDCTSP] = useState([]); // idCTSP[]

  const [khuyenMai, setKhuyenMais] = useState([]);

  useEffect(() => {
    loadKhuyenMai();
  }, []);

  const loadKhuyenMai = async () => {
    try {
      const response = await DotGiamGiaAPI.getAll();
      setKhuyenMais(response.data || []);
    } catch (error) {
      console.error("Lỗi load khuyến mãi:", error);
    }
  };

  // --- Validators dùng dayjs trực tiếp ---
  const validateDateKT = (_, value) => {
    const start = formThemKhuyenMai.getFieldValue("ngay_bat_dau"); // dayjs
    if (start && value && value.isBefore(start)) {
      return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu"));
    }
    return Promise.resolve();
  };

  const validateDateBD = (_, value) => {
    const end = formThemKhuyenMai.getFieldValue("ngay_ket_thuc"); // dayjs
    if (end && value && value.isAfter(end)) {
      return Promise.reject(new Error("Ngày bắt đầu phải trước ngày kết thúc"));
    }
    return Promise.resolve();
  };

  const loaiKM = Form.useWatch("loai", formThemKhuyenMai) || "Tiền mặt";

  const handleSubmit = (values) => {
    try {
      const payload = { ...values };

      // ✅ Gửi LocalDateTime chuẩn ISO-8601 (không timezone): "YYYY-MM-DDTHH:mm:ss"
      if (values.ngay_bat_dau) {
        payload.ngay_bat_dau = dayjs(values.ngay_bat_dau).format(LDT_FORMAT);
      }
      if (values.ngay_ket_thuc) {
        payload.ngay_ket_thuc = dayjs(values.ngay_ket_thuc).format(LDT_FORMAT);
      }

      DotGiamGiaAPI.create(payload)
        .then((response) => {
          const createdPromotionId = response.data;

          if (selectedIDCTSP.length > 0) {
            selectedIDCTSP.forEach((id) =>
              DotGiamGiaAPI.updateSanPhamKhuyenMai(id, createdPromotionId)
            );
          }

          toast("✔️ Thêm thành công!", {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
          });

          navigate("/admin-dot-giam-gia");
          loadKhuyenMai();
          setSelectedIDSP([]);
          setSelectedIDCTSP([]);
          formThemKhuyenMai.resetFields();
        })
        .catch((error) => {
          console.error("Lỗi thêm khuyến mãi:", error);
          toast.error("Thêm thất bại");
        });
    } catch (err) {
      console.error("Lỗi xử lý ngày giờ:", err);
      toast.error("Lỗi xử lý ngày giờ");
    }
  };

  const handleSelectedSanPham = (keys) => {
    setSelectedIDSP(keys);
    setSelectedIDCTSP([]); // reset CTSP khi đổi SP
  };

  const handleSelectedCTSanPham = (keys) => {
    setSelectedIDCTSP(keys);
  };

  return (
    <div className="container-fuild">
      <div>
        <Breadcrumb
          style={{ marginTop: "10px" }}
          items={[
            {
              title: (
                <Link to="/admin-ban-hang">
                  <HomeOutlined />
                </Link>
              ),
            },
            {
              title: (
                <Link to="/admin-ban-hang">
                  <BiSolidDiscount size={15} style={{ paddingBottom: 2 }} />
                  <span> Giảm giá</span>
                </Link>
              ),
            },
            {
              title: (
                <Link to="/admin-dot-giam-gia">
                  <LuBadgePercent size={15} style={{ paddingBottom: 2 }} />
                  <span> Đợt giảm giá</span>
                </Link>
              ),
            },
            { title: "Thêm đợt giảm giá" },
          ]}
        />

        <div className="container-fluid">
          <br />
          <div className="row">
            <Divider orientation="center">
              <h2 className="text-first pt-1 fw-bold">
                <LuBadgePercent /> Thêm đợt giảm giá
              </h2>
            </Divider>

            {/* Form trái */}
            <div
              className="bg-light col-md-4"
              style={{ borderRadius: 20, marginBottom: 10, height: 550 }}
            >
              <Divider orientation="left">
                <h4 className="text-first pt-1 fw-bold">
                  <LuBadgePercent /> Thông tin đợt giảm giá
                </h4>
              </Divider>

              <Form
                form={formThemKhuyenMai}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ loai: "Tiền mặt" }}
                onFinish={handleSubmit}
                style={{ maxWidth: 1600 }}
              >
                <Form.Item
                  label="Tên Khuyến Mại"
                  name="ten"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng không để trống tên!" },
                  ]}
                  style={{ marginLeft: 0, width: 500 }}
                >
                  <Input
                    placeholder="Tên khuyến mại"
                    style={{ marginLeft: 20, width: 220 }}
                  />
                </Form.Item>

                <Form.Item
                  label="Loại"
                  name="loai"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng chọn phương thức!" },
                  ]}
                  style={{ marginLeft: 0, width: 500 }}
                >
                  <Select style={{ marginLeft: 20, width: 220 }}>
                    <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                    <Select.Option value="Phần trăm">Phần trăm</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Giá trị giảm"
                  name="gia_tri_khuyen_mai"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập giá trị giảm !" },
                  ]}
                  style={{ marginLeft: 0, width: 500 }}
                >
                  {loaiKM === "Tiền mặt" ? (
                    <InputNumber
                      min={0}
                      formatter={(value) =>
                        `VND ${value ?? 0}`.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )
                      }
                      parser={(value) =>
                        String(value ?? "").replace(/[^\d]/g, "")
                      }
                      style={{ marginLeft: 20, width: 220 }}
                    />
                  ) : (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={(value) => `${value ?? 0}%`}
                      parser={(value) =>
                        String(value ?? "").replace(/[^\d]/g, "")
                      }
                      style={{ marginLeft: 20, width: 220 }}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  label="Ngày bắt đầu"
                  name="ngay_bat_dau"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                    { validator: validateDateBD },
                  ]}
                  style={{ marginLeft: 0, width: 500 }}
                >
                  <DatePicker
                    showTime
                    // Hiển thị có thể để "YYYY-MM-DD HH:mm:ss"
                    // nhưng khi submit ta format sang ISO-8601 ở handleSubmit
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ marginLeft: 20, width: 220 }}
                    placeholder="Ngày bắt đầu"
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày kết thúc"
                  name="ngay_ket_thuc"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                    { validator: validateDateKT },
                  ]}
                  style={{ marginLeft: 0, width: 500 }}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ marginLeft: 20, width: 220 }}
                    placeholder="Ngày kết thúc"
                  />
                </Form.Item>

                <div className="text-end" style={{ marginTop: 50 }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      className=" bg-warning rounded-pill"
                      onClick={() => {
                        Modal.confirm({
                          title: "Thông báo",
                          content: "Bạn có chắc chắn muốn thêm không?",
                          onOk: () => formThemKhuyenMai.submit(),
                          footer: (_, { OkBtn, CancelBtn }) => (
                            <>
                              <CancelBtn />
                              <OkBtn />
                            </>
                          ),
                        });
                      }}
                    >
                      Thêm
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>

            {/* Bảng phải */}
            <div className="col" style={{ marginLeft: 20 }}>
              <div className="row bg-light" style={{ borderRadius: 20 }}>
                <div>
                  <p className="fw-bold" style={{ marginTop: 10 }}>
                    Sản phẩm
                  </p>
                </div>
                <TableSanPham onSelectedSanPham={handleSelectedSanPham} />
              </div>

              <div
                className="row bg-light"
                style={{ borderRadius: 20, marginTop: 10, marginBottom: 10 }}
              >
                <div>
                  <p className="fw-bold" style={{ marginTop: 10 }}>
                    Chi Tiết Sản Phẩm
                  </p>
                </div>
                <TableChiTietSanPham
                  selectedIDSPs={selectedIDSP}
                  onSelectedCTSanPham={handleSelectedCTSanPham}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemDotGiamGia;
