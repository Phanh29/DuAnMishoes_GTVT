import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Radio,
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
import { ToastContainer, toast } from "react-toastify";

import { GiMaterialsScience } from "react-icons/gi";
import { BsFillEyeFill } from "react-icons/bs";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";

export default function ChatLieu() {
  // Helpers: bỏ dấu & chuẩn hóa
  const removeVietnameseTones = (str = "") =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const norm = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => setComponentSize(size);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [formTim] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [chatLieu, setChatLieus] = useState([]);
  const [clUpdate, setClUpdate] = useState("");
  const [tenCheck, setTenCheck] = useState("");

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  useEffect(() => {
    loadChatLieu();
  }, []);

  const loadChatLieu = () => {
    ThuocTinhAPI.getAll("chat-lieu").then((res) => setChatLieus(res.data));
  };

  // Add
  const addChatLieu = (value) => {
    const checkTrung = (code) =>
      chatLieu.some((cl) => norm(cl.ten) === norm(code));

    if (!checkTrung(value.ten)) {
      ThuocTinhAPI.create("chat-lieu", value).then(() => {
        toast("✔️ Thêm thành công!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        loadChatLieu();
        setOpen(false);
        form.resetFields();
      });
    } else {
      toast.error("Chất liệu đã tồn tại!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  // Detail -> open Update modal
  const showModal = async (id) => {
    await ThuocTinhAPI.detail("chat-lieu", id).then((res) => {
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
      setClUpdate(res.data);
    });
    setOpenUpdate(true);
  };

  // Update
  const updateChatLieu = () => {
    if (clUpdate.ten !== tenCheck) {
      const checkTrung = (ten) =>
        chatLieu.some((x) => norm(x.ten) === norm(ten));
      if (checkTrung(clUpdate.ten)) {
        toast.error("Chất liệu trùng với chất liệu khác !", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        return;
      }
    }
    ThuocTinhAPI.update("chat-lieu", clUpdate.id, clUpdate).then(() => {
      toast("✔️ Sửa thành công!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      setClUpdate("");
      loadChatLieu();
      setOpenUpdate(false);
    });
  };

  // Validate rules
  const validateDateAdd = () => {
    const tenTim = form.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim()) {
      return Promise.reject("Tên không được để trống");
    }
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(tenTim)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }
    if (tenTim.trim().length > 30) {
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    }
    return Promise.resolve();
  };

  const validateDateKichThuocUpdate = () => {
    const tenTim = form1.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim()) {
      return Promise.reject("Tên không được để trống");
    }
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(tenTim)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }
    if (tenTim.trim().length > 30) {
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    }
    return Promise.resolve();
  };

  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30) {
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    }
    return Promise.resolve();
  };

  // ====== TÌM KIẾM & LỌC (client-side) ======
  // Watch giá trị filter từ form
  const kwWatch = Form.useWatch("ten", formTim) ?? ""; // chuỗi tìm kiếm: tên hoặc mã
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined

  // Tách từ khóa theo khoảng trắng, yêu cầu khớp tất cả (AND)
  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  // Dữ liệu sau filter
  const filteredChatLieu = useMemo(() => {
    return chatLieu.filter((item) => {
      // Lọc theo trạng thái (nếu chọn)
      if (
        statusWatch !== undefined &&
        statusWatch !== null &&
        statusWatch !== ""
      ) {
        if (String(item.trangThai) !== String(statusWatch)) return false;
      }
      // Lọc theo tên/mã
      if (tokenized.length === 0) return true;
      const haystack = norm(`${item.ten ?? ""} ${item.ma ?? ""}`);
      return tokenized.every((tok) => haystack.includes(tok));
    });
  }, [chatLieu, statusWatch, tokenized]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "stt",
      align: "center",
      render: (_id, _record, index) => index + 1,
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
      onFilter: (value, record) => String(record.trangThai) === String(value),
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
            <GiMaterialsScience size={35} /> Quản lý chất liệu
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
                <Input
                  allowClear
                  maxLength={31}
                  placeholder="Nhập tên hoặc mã"
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
                    loadChatLieu();
                  }}
                >
                  Làm mới
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className="text-end">
          <button onClick={() => setOpen(true)} className="button-them">
            <span className="text">
              <PlusCircleOutlined /> Thêm chất liệu
            </span>
          </button>
        </div>

        {/* Danh sách */}
        <div
          className=" bg-light m-2 p-3 pt-2"
          style={{
            border: "1px solid #ddd",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <h5>
            <BookFilled size={30} /> Danh sách chất liệu
          </h5>
          <hr />
          <div className="ms-3">
            {/* Modal Add */}
            <Modal
              title="Thêm Chất Liệu"
              centered
              open={open}
              onCancel={() => setOpen(false)}
              onOk={() => form.submit()}
              okText="Thêm"
              cancelText="Hủy"
              width={500}
            >
              <Form
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{ maxWidth: 1000 }}
                onFinish={addChatLieu}
                form={form}
              >
                <Form.Item
                  label="Tên"
                  name="ten"
                  hasFeedback
                  rules={[{ required: true, validator: validateDateAdd }]}
                >
                  <Input maxLength={31} className="border" />
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal Update */}
            <Modal
              title="Sửa Chất Liệu"
              centered
              open={openUpdate}
              onCancel={() => setOpenUpdate(false)}
              onOk={() => form1.submit()}
              okText="Sửa"
              cancelText="Hủy"
              width={500}
            >
              <Form
                {...formItemLayout}
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{ maxWidth: 1000 }}
                onFinish={updateChatLieu}
                form={form1}
              >
                <Form.Item
                  name="ten"
                  label={<b>Tên</b>}
                  hasFeedback
                  rules={[
                    { required: true, validator: validateDateKichThuocUpdate },
                  ]}
                >
                  <Input
                    className="border"
                    maxLength={31}
                    value={clUpdate?.ten}
                    onChange={(e) =>
                      setClUpdate({ ...clUpdate, ten: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item name="trangThai" label={<b>Trạng thái</b>}>
                  <Radio.Group
                    onChange={(e) =>
                      setClUpdate({ ...clUpdate, trangThai: e.target.value })
                    }
                    value={clUpdate?.trangThai}
                  >
                    <Radio value={0}>Còn bán</Radio>
                    <Radio value={1}>Dừng bán</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Modal>
          </div>

          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredChatLieu}
              columns={columns}
              rowKey={(r) => r.id}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredChatLieu.length,
              }}
            />
          </div>
        </div>
      </div>
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
