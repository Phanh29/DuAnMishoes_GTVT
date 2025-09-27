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
import { BiSolidCategory } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import { BsFillEyeFill } from "react-icons/bs";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";
import AddDanhMucModal from "./Modal/AddDanhMucModal";
import UpdateDanhMuc from "./Modal/UpdateDanhMucModal";

export default function DanhMuc() {
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  const [formTim] = Form.useForm();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [danhMuc, setDanhMucs] = useState([]);
  const [dmUpdate, setDmUpdate] = useState("");
  const [tenCheck, setTenCheck] = useState("");

  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  useEffect(() => {
    loadDanhMuc();
  }, []);

  const loadDanhMuc = () => {
    ThuocTinhAPI.getAll("danh-muc").then((res) => setDanhMucs(res.data));
  };

  const showModal = async (id) => {
    await ThuocTinhAPI.detail("danh-muc", id).then((res) => {
      form1.setFieldsValue({
        id: res.data.id,
        ma: res.data.ma,
        ten: res.data.ten,
        trangThai: res.data.trangThai,
      });
      setTenCheck(res.data.ten);
      setDmUpdate(res.data);
    });
    setOpenUpdate(true);
  };
  
  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  // filter
  const kwWatch = Form.useWatch("ten", formTim) ?? "";
  const statusWatch = Form.useWatch("trangThai", formTim);
  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredDanhMuc = useMemo(() => {
    return danhMuc.filter((item) => {
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
  }, [danhMuc, statusWatch, tokenized]);

  const columns = [
    {
      title: "STT",
      render: (_id, _record, index) => index + 1,
      align: "center",
    },
    {
      title: "Mã",
      dataIndex: "ma",
      sorter: (a, b) => String(a.ma).localeCompare(String(b.ma)),
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "ten",
      sorter: (a, b) => String(a.ten).localeCompare(String(b.ten)),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      align: "center",
      filters: [
        { text: "Còn bán", value: 0 },
        { text: "Dừng bán", value: 1 },
      ],
      onFilter: (val, record) => String(record.trangThai) === String(val),
      render: (t) =>
        t === 0 ? (
          <Tag color="green">Còn bán</Tag>
        ) : (
          <Tag color="red">Dừng bán</Tag>
        ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      align: "center",
      render: (id) => (
        <Space>
          <a className="btn btn-danger" onClick={() => showModal(id)}>
            <BsFillEyeFill />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid" style={{ borderRadius: 20 }}>
      <Divider orientation="center" color="#d0aa73">
        <h4 className="text-first pt-1 fw-bold">
          <BiSolidCategory size={35} /> Quản lý danh mục
        </h4>
      </Divider>

      {/* Bộ lọc */}
      <div
        className=" bg-light m-2 p-3 pt-2"
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
              <Input allowClear maxLength={31} placeholder="Nhập tên hoặc mã" />
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
                  loadDanhMuc();
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
            <PlusCircleOutlined /> Thêm danh mục
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
          <BookFilled size={30} /> Danh sách danh mục
        </h5>
        <hr />

        {/* Modal Add */}
        <AddDanhMucModal
          open={open}
          onClose={() => setOpen(false)}
          form={form}
          componentSize={componentSize}
          onFormLayoutChange={onFormLayoutChange}
          dm={danhMuc}
          loadDM={loadDanhMuc}
        />

        {/* Modal Update */}
        <UpdateDanhMuc
          openUpdate={openUpdate}
          setOpenUpdate={setOpenUpdate}
          form1={form1}
          dmUpdate={dmUpdate}
          setDmUpdate={setDmUpdate}
          tenCheck={tenCheck}
          danhMuc={danhMuc}
          loadDanhMuc={loadDanhMuc}
          norm={norm}
          formItemLayout={formItemLayout}
        />

        <Table
          dataSource={filteredDanhMuc}
          columns={columns}
          rowKey={(r) => r.id}
          pagination={{
            showQuickJumper: true,
            defaultPageSize: 5,
            position: ["bottomCenter"],
            total: filteredDanhMuc.length,
          }}
        />
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
