import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Radio,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
} from "antd";
import { PlusCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { BookFilled } from "@ant-design/icons";
import { FilterFilled } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillEyeFill } from "react-icons/bs";
import { PiTrademarkFill } from "react-icons/pi";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";
import AddHangModal from "./Modal/AddHangModal";
import UpdateHang from "./Modal/UpdateHangModal";

export default function Hang() {
  // ==== Helpers: bỏ dấu & chuẩn hoá chuỗi tìm kiếm ====
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  // ==== Forms ====
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [formTim] = Form.useForm();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);

  // ==== Modal states ====
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // ==== Data ====
  const [hang, setHangs] = useState([]);
  const [hangUpdate, setHangUpdate] = useState("");
  const [tenCheck, setTenCheck] = useState("");

  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  useEffect(() => {
    loadHang();
  }, []);

  const loadHang = () => {
    ThuocTinhAPI.getAll("hang").then((res) => setHangs(res.data));
  };
  // ==== Detail -> open update modal ====
  const showModal = async (id) => {
    await ThuocTinhAPI.detail("hang", id).then((res) => {
      form1.setFieldsValue({
        id: res.data.id,
        ma: res.data.ma,
        ten: res.data.ten,
        trangThai: res.data.trangThai,
        ngayTao: res.data.ngayTao,
        ngaySua: res.data.ngaySua,
        nguoiTao: res.data.nguoiTao,
        nguoiSua: res.data.nguoiSua,
      });
      setTenCheck(res.data.ten);
      setHangUpdate(res.data);
    });
    setOpenUpdate(true);
  };

  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  // ==== TÌM KIẾM & LỌC (client-side) ====
  const kwWatch = Form.useWatch("ten", formTim) ?? "";
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined

  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredHang = useMemo(() => {
    return hang.filter((item) => {
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
  }, [hang, statusWatch, tokenized]);

  // ==== Table ====
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
            <PiTrademarkFill size={35} /> Quản lý hãng
          </h4>
        </Divider>

        {/* Bộ lọc */}
        <div
          className="bg-light m-2 p-3 pt-2"
          style={{
            border: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
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
            initialValues={{ size: componentSize }}
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
                    loadHang();
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
              <PlusCircleOutlined /> Thêm hãng
            </span>
          </button>
        </div>

        {/* Danh sách */}
        <div
          className="bg-light m-2 p-3 pt-2"
          style={{
            border: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <h5>
            <BookFilled size={30} /> Danh sách hãng
          </h5>
          <hr />

          <div className="ms-3">
            {/* Modal Add  */}
            <AddHangModal
              open={open}
              onClose={() => setOpen(false)}
              form={form1}
              componentSize={componentSize}
              onFormLayoutChange={onFormLayoutChange}
              h={hang}
              loadH={loadHang}
            />

            {/* Modal Update  */}
            <UpdateHang
              openUpdate={openUpdate}
              setOpenUpdate={setOpenUpdate}
              form1={form1}
              hangUpdate={hangUpdate}
              setHangUpdate={setHangUpdate}
              tenCheck={tenCheck}
              hang={hang}
              loadHang={loadHang}
              norm={norm}
              componentSize={componentSize}
              onFormLayoutChange={onFormLayoutChange}
              formItemLayout={formItemLayout}
            />
          </div>

          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredHang}
              columns={columns}
              rowKey={(r) => r.id}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredHang.length,
              }}
            />
          </div>
        </div>
      </div>

      {/* Toast container (một nơi duy nhất trong app cũng được) */}
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
      />
    </div>
  );
}
