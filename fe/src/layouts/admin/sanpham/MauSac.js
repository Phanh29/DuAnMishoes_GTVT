import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
  Radio,
} from "antd";
import {
  PlusCircleOutlined,
  RetweetOutlined,
  BookFilled,
  FilterFilled,
} from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillEyeFill } from "react-icons/bs";
import { IoColorPalette } from "react-icons/io5";
import convert from "color-convert";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";
import AddMauSacModal from "./Modal/AddMauSac";
import UpdateMauSac from "./Modal/UpdateMauSac";

export default function MauSac() {
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  // ===== Helpers: bỏ dấu để tìm kiếm không phân biệt dấu =====
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  // ===== Forms =====
  const [form] = Form.useForm(); // Add form
  const [form1] = Form.useForm(); // Update form
  const [formTim] = Form.useForm(); // Filter form
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);

  // ===== Data / state =====
  const [mauSac, setMauSacs] = useState([]);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [msUpdate, setmsUpdates] = useState({});
  const [tenCheck, setTenCheck] = useState("");
  const [maCheck, setMaCheck] = useState("");

  useEffect(() => {
    loadMauSac();
  }, []);
  const loadMauSac = () => {
    ThuocTinhAPI.getAll("mau-sac").then((res) => setMauSacs(res.data));
  };

  // ====== Filter (client-side) ======
  const kwWatch = Form.useWatch("ten", formTim) ?? ""; // tìm theo tên/mã
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined

  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredMauSac = useMemo(() => {
    return mauSac.filter((item) => {
      if (
        statusWatch !== undefined &&
        statusWatch !== null &&
        statusWatch !== ""
      ) {
        if (String(item.trangThai) !== String(statusWatch)) return false;
      }
      if (tokenized.length === 0) return true;
      const haystack = norm(`${item.ten ?? ""} ${item.ma ?? ""}`);
      return tokenized.every((tok) => haystack.includes(tok));
    });
  }, [mauSac, statusWatch, tokenized]);

  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };
  // ====== Detail → open Update ======
  const showModal = async (id) => {
    const res = await ThuocTinhAPI.detail("mau-sac", id);
    const data = res.data;
    form1.setFieldsValue({
      id: data.id,
      ma: data.ma,
      ten: data.ten,
      trangThai: data.trangThai,
      ngayTao: data.ngayTao,
      ngaySua: data.ngaySua,
      nguoiTao: data.nguoiTao,
      nguoiSua: data.nguoiSua,
    });
    setmsUpdates(data);
    setTenCheck(data.ten);
    setMaCheck(data.ma);
    setOpenUpdate(true);
  };
  // ====== Columns ======
  const columns = [
    {
      title: "STT",
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
      title: "Màu",
      dataIndex: "ma",
      key: "Ma",
      render: (text, record) => {
        return <>
          <div style={{
            backgroundColor: `${record.ma}`,
            borderRadius: 6,
            width: 60,
            height: 25,
          }} className='custom-div'></div >
        </>;
      }
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
      render: (st) =>
        Number(st) === 0 ? (
          <Tag color="green">Còn bán</Tag>
        ) : (
          <Tag color="red">Dừng bán</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "id",
      align: "center",
      render: (id) => (
        <Space size="middle">
          <a className="btn btn-danger" onClick={() => showModal(String(id))}>
            <BsFillEyeFill className="mb-1" />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid" style={{ borderRadius: 20 }}>
      <div className="container-fluid">
        <Divider orientation="center" color="#d0aa73">
          <h4 className="text-first pt-1 fw-bold">
            <IoColorPalette size={35} /> Quản lý màu sắc
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
            size={componentSize}
            style={{ maxWidth: 1400 }}
          >
            <div className="col-md-6">
              <Form.Item
                label="Tên & Mã"
                name="ten"
                rules={[{ validator: validateDateTim }]}
              >
                <Input
                  allowClear
                  maxLength={31}
                  placeholder="Nhập tên hoặc mã (không phân biệt dấu)"
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="Trạng Thái" name="trangThai">
                <Select
                  placeholder="Chọn trạng thái"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Select.Option value={0}>Còn Bán</Select.Option>
                  <Select.Option value={1}>Dừng Bán</Select.Option>
                </Select>
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
                    loadMauSac();
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
          <button onClick={() => setOpen(true)} className="button-them">
            <span className="text">
              <PlusCircleOutlined /> Thêm màu sắc
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
            <BookFilled size={30} /> Danh sách màu sắc
          </h5>
          <hr />

          <div className="ms-3">
            {/* Modal Thêm */}
            <AddMauSacModal
              open={open}
              onClose={() => setOpen(false)}
              form={form}
              componentSize={componentSize}
              onFormLayoutChange={onFormLayoutChange}
              formItemLayout={formItemLayout}
              msData={mauSac}
              loadMS={loadMauSac}
            />

            {/* Modal Sửa */}
            <UpdateMauSac
              openUpdate={openUpdate}
              setOpenUpdate={setOpenUpdate}
              form1={form1}
              msUpdate={msUpdate}
              setmsUpdates={setmsUpdates}
              tenCheck={tenCheck}
              maCheck={maCheck}
              mauSac={mauSac}
              loadMauSac={loadMauSac}
              formItemLayout={formItemLayout}
            />
          </div>

          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredMauSac}
              columns={columns}
              rowKey={(r) => r.id}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredMauSac.length,
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
