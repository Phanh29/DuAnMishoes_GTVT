import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Slider,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  RetweetOutlined,
  BookFilled,
  FilterFilled,
} from "@ant-design/icons";
import { BsFillEyeFill } from "react-icons/bs";
import { FaTshirt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";

export default function SanPham() {
  // Helpers: bỏ dấu & chuẩn hoá tìm kiếm
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  const nav = useNavigate();

  // Forms
  const [formTim] = Form.useForm();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);

  // Dữ liệu
  const [sanPham, setSanPhams] = useState([]);
  const [listMS, setListMs] = useState({}); // { [idSP]: string[] }
  const [listKT, setListKt] = useState({}); // { [idSP]: string[] }

  const loadListMauSac = (id) => {
    if (!listMS[id]) {
      ThuocTinhAPI.getListMauSacBySanPhamId(id).then((res) => {
        setListMs((prev) => ({ ...prev, [id]: res.data || [] }));
      });
    }
  };

  const loadListKichThuoc = (id) => {
    if (!listKT[id]) {
      ThuocTinhAPI.getListKichThuocBySanPhamId(id).then((res) => {
        setListKt((prev) => ({ ...prev, [id]: res.data || [] }));
      });
    }
  };

  const loadSanPham = () => {
    ThuocTinhAPI.getAll("san-pham").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setSanPhams(data);
      data.forEach((sp) => {
        if (sp?.idSP != null) {
          loadListMauSac(sp.idSP);
          loadListKichThuoc(sp.idSP);
        }
      });
    });
  };

  useEffect(() => {
    loadSanPham();
  }, []);

  // ====== TÌM KIẾM & LỌC (client-side) ======
  // Watch các giá trị từ form
  const kwWatch = Form.useWatch("ten", formTim) ?? ""; // Tên/Mã
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined
  const soLuongWatch = Form.useWatch("soLuong", formTim) ?? [1, 1000]; // [min, max]

  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredSanPham = useMemo(() => {
    const [minSL, maxSL] = Array.isArray(soLuongWatch)
      ? soLuongWatch
      : [1, 1000];

    return sanPham.filter((item) => {
      // Lọc theo trạng thái
      if (
        statusWatch !== undefined &&
        statusWatch !== null &&
        statusWatch !== ""
      ) {
        if (String(item.trangThai) !== String(statusWatch)) return false;
      }

      // Lọc theo số lượng (range)
      const soLuong = Number(item.soLuong ?? 0);
      if (soLuong < Number(minSL) || soLuong > Number(maxSL)) return false;

      // Tìm theo tên/mã (không dấu, AND theo token)
      if (tokenized.length > 0) {
        const haystack = norm(`${item.ten ?? ""} ${item.ma ?? ""}`);
        const ok = tokenized.every((tok) => haystack.includes(tok));
        if (!ok) return false;
      }

      return true;
    });
  }, [sanPham, statusWatch, soLuongWatch, tokenized]);

  // Validate
  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  // Handlers
  const themSP = () => nav("/admin-them-san-pham");

  const onChangeFilter = (changedValues, allValues) => {
    // Trim tên khi gõ
    if ("ten" in changedValues) {
      const val = (allValues.ten ?? "").trimStart(); // tránh nhảy con trỏ khi trim toàn bộ
      formTim.setFieldsValue({ ten: val });
    }
  };

  // Table
  const columns = [
    {
      title: "STT",
      dataIndex: "idSP",
      key: "stt",
      align: "center",
      render: (_id, _record, index) => index + 1,
      showSorterTooltip: false,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
      align: "center",
      sorter: (a, b) => String(a.ma ?? "").localeCompare(String(b.ma ?? "")),
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      sorter: (a, b) => String(a.ten ?? "").localeCompare(String(b.ten ?? "")),
    },
    {
      title: "Màu sắc",
      key: "mauSac",
      align: "center",
      width: 160,
      render: (_val, record) => {
        const mauSacList = listMS[record.idSP] || [];
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {mauSacList.map((mau, idx) => (
              <Tag
                key={idx}
                style={{
                  width: 40,
                  height: 20,
                  border: "1px solid #C6C5C5",
                  padding: 0,
                }}
                color={mau}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: "Kích thước",
      key: "kichThuoc",
      align: "center",
      width: 160,
      render: (_val, record) => {
        const kichThuocList = listKT[record.idSP] || [];
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {kichThuocList.map((kt, idx) => (
              <Tag
                key={idx}
                style={{
                  textAlign: "center",
                  width: 40,
                  height: 20,
                  backgroundColor: "white",
                  border: "1px solid #C6C5C5",
                }}
              >
                {kt}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      align: "center",
      sorter: (a, b) => Number(a.soLuong ?? 0) - Number(b.soLuong ?? 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      filters: [
        { text: "Còn bán", value: 0 },
        { text: "Dừng bán", value: 1 },
      ],
      onFilter: (val, record) => String(record.trangThai) === String(val),
      render: (trang_thai) =>
        Number(trang_thai) === 0 ? (
          <Tag color="green">Còn bán</Tag>
        ) : (
          <Tag color="red">Dừng bán</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      dataIndex: "idSP",
      render: (idSP) => (
        <Space size="middle">
          <Link to={`/admin-showct/${idSP}`} className="btn btn-danger">
            <BsFillEyeFill className="mb-1" />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid" style={{ borderRadius: 20 }}>
      <div className="container-fluid">
        <Divider orientation="center" color="#d0aa73">
          <h4 className="text-first pt-1 fw-bold">
            <FaTshirt size={35} /> Quản lý sản phẩm
          </h4>
        </Divider>

        {/* Bộ lọc */}
        <div
          className="bg-light m-2 p-3 pt-2"
          style={{
            border: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <h5>
            <FilterFilled size={30} /> Bộ lọc
          </h5>
          <hr />
          <Form
            form={formTim}
            className="row"
            initialValues={{ size: componentSize, soLuong: [1, 1000] }}
            size={componentSize}
            style={{ maxWidth: 1400 }}
            onValuesChange={onChangeFilter}
          >
            <div className="col-md-4">
              <Form.Item
                label="Tên & Mã"
                name="ten"
                rules={[{ validator: validateDateTim }]}
              >
                <Input
                  allowClear
                  maxLength={31}
                  placeholder="Nhập tên hoặc mã"
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item label="Trạng thái" name="trangThai">
                <Select placeholder="Chọn trạng thái" allowClear>
                  <Select.Option value={0}>Còn bán</Select.Option>
                  <Select.Option value={1}>Dừng bán</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item label="Số lượng" name="soLuong">
                <Slider range step={1} min={1} max={1000} />
              </Form.Item>
            </div>

            <div className="col-12 text-center">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="reset"
                  icon={<RetweetOutlined />}
                  onClick={() => {
                    formTim.resetFields();
                    loadSanPham();
                  }}
                >
                  Làm mới
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>

        {/* Nút thêm */}
        <div className="text-end">
          <button onClick={themSP} className="button-them">
            <span className="text">
              <PlusCircleOutlined /> Thêm sản phẩm
            </span>
          </button>
        </div>

        {/* Danh sách */}
        <div
          className="bg-light m-2 p-3 pt-2"
          style={{
            border: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <h5>
            <BookFilled size={30} /> Danh sách sản phẩm
          </h5>
          <hr />
          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredSanPham}
              columns={columns}
              rowKey="idSP"
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredSanPham.length,
              }}
            />
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
