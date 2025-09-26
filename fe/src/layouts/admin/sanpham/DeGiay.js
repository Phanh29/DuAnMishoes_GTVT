import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Radio,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
} from "antd";
import {
  PlusCircleOutlined,
  RetweetOutlined,
  BookFilled,
  FilterFilled,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { BsFillEyeFill } from "react-icons/bs";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";
import AddDoCaoModal from "./Modal/AddDoCaoModal";
import UpdateDeGiay from "./Modal/UpdateDeGiayModal";

export default function DeGiay() {
  // Helpers: bỏ dấu & chuẩn hoá tìm kiếm
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  // Forms
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [formTim] = Form.useForm();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);

  // Modals
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // Data
  const [deGiay, setDeGiays] = useState([]);
  const [dgUpdate, setDgUpdate] = useState("");
  const [tenCheck, setTenCheck] = useState("");

  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  useEffect(() => {
    loadDeGiay();
  }, []);

  const loadDeGiay = () => {
    ThuocTinhAPI.getAll("de-giay").then((res) => setDeGiays(res.data));
  };

  // Detail -> open Update modal
  const showModal = async (id) => {
    await ThuocTinhAPI.detail("de-giay", id).then((res) => {
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
      setDgUpdate(res.data);
    });
    setOpenUpdate(true);
  };

  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  // ====== TÌM KIẾM & LỌC (client-side) ======
  const kwWatch = Form.useWatch("ten", formTim) ?? ""; // string tìm theo tên/mã
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined

  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredDeGiay = useMemo(() => {
    return deGiay.filter((item) => {
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
  }, [deGiay, statusWatch, tokenized]);

  // Table
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
      // Sort theo số (fallback về 0 nếu không phải số)
      sorter: (a, b) => (parseFloat(a.ten) || 0) - (parseFloat(b.ten) || 0),
      // Hiển thị kèm " cm"
      render: (ten) => `${ten} cm`,
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
            <AiOutlineColumnHeight size={35} /> Quản lý đế giày
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
                    loadDeGiay();
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
              <PlusCircleOutlined /> Thêm Đế Giày
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
            <BookFilled size={30} /> Danh sách đế giày
          </h5>
          <hr />

          <div className="ms-3">
            <AddDoCaoModal
              open={open}
              onClose={() => setOpen(false)}
              form={form}
              componentSize={componentSize}
              onFormLayoutChange={onFormLayoutChange}
              dc={deGiay}
              loadDC={loadDeGiay}
            />

            {/* Modal Update – KHÔNG dùng onOk; footer=null; nút submit trong Form */}
            <UpdateDeGiay
              openUpdate={openUpdate}
              setOpenUpdate={setOpenUpdate}
              form1={form1}
              dgUpdate={dgUpdate}
              setDgUpdate={setDgUpdate}
              tenCheck={tenCheck}
              deGiay={deGiay}
              loadDeGiay={loadDeGiay}
              norm={norm}
              componentSize={componentSize}
              onFormLayoutChange={onFormLayoutChange}
              formItemLayout={formItemLayout}
            />
          </div>

          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredDeGiay}
              columns={columns}
              rowKey={(r) => r.id}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredDeGiay.length,
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
        theme="light"
      />
    </div>
  );
}
