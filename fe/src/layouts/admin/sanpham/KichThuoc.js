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
import { PlusCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { BookFilled } from "@ant-design/icons";
import { FilterFilled } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillEyeFill } from "react-icons/bs";
import { GoNumber } from "react-icons/go";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";

export default function KichThuoc() {
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

  // Modal state
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // Data
  const [kichThuoc, setKichThuocs] = useState([]);
  const [ktUpdate, setKtUpdate] = useState("");
  const [tenCheck, setTenCheck] = useState("");

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  useEffect(() => {
    loadKichThuoc();
  }, []);

  const loadKichThuoc = () => {
    ThuocTinhAPI.getAll("kich-thuoc").then((res) => setKichThuocs(res.data));
  };

  // Add
  const addKichThuoc = (value) => {
    const exists = kichThuoc.some((kt) => norm(kt.ten) === norm(value.ten));
    if (!exists) {
      ThuocTinhAPI.create("kich-thuoc", value).then(() => {
        toast.success("✔️ Thêm thành công!");
        loadKichThuoc();
        setOpen(false);
        form.resetFields(); // ✅ reset đúng form thêm
      });
    } else {
      toast.error("Kích thước đã tồn tại!");
    }
  };

  // Detail -> open Update modal
  const showModal = async (id) => {
    await ThuocTinhAPI.detail("kich-thuoc", id).then((res) => {
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
      setKtUpdate(res.data);
    });
    setOpenUpdate(true);
  };

  // Update
  const updateKichThuoc = () => {
    if (ktUpdate.ten !== tenCheck) {
      const exists = kichThuoc.some((x) => norm(x.ten) === norm(ktUpdate.ten));
      if (exists) {
        toast.error("Kích thước trùng với kích thước khác!");
        return;
      }
    }
    ThuocTinhAPI.update("kich-thuoc", ktUpdate.id, ktUpdate).then(() => {
      toast.success("✔️ Sửa thành công!");
      setKtUpdate("");
      loadKichThuoc();
      setOpenUpdate(false);
    });
  };

  // Validate
  const validateDateKichThuoc = (_, value) => {
    const tenTim = form.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim())
      return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(tenTim))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 34 || n > 47)
      return Promise.reject("Kích thước phải là số nguyên từ 34 đến 47");
    return Promise.resolve();
  };

  const validateDateKichThuocUpdate = (_, value) => {
    const tenTim = form1.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim())
      return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(tenTim))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 34 || n > 47)
      return Promise.reject("Kích thước phải là số nguyên từ 34 đến 47");
    return Promise.resolve();
  };

  const validateDateTim = () => {
    const ten = (formTim.getFieldValue("ten") || "").trim();
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  // ====== TÌM KIẾM & LỌC (client-side) ======
  const kwWatch = Form.useWatch("ten", formTim) ?? ""; // tìm theo tên/mã
  const statusWatch = Form.useWatch("trangThai", formTim); // 0 | 1 | undefined

  const tokenized = useMemo(() => {
    const s = norm(kwWatch);
    return s ? s.split(/\s+/).filter(Boolean) : [];
  }, [kwWatch]);

  const filteredKichThuoc = useMemo(() => {
    return kichThuoc.filter((item) => {
      // lọc trạng thái
      if (
        statusWatch !== undefined &&
        statusWatch !== null &&
        statusWatch !== ""
      ) {
        if (String(item.trangThai) !== String(statusWatch)) return false;
      }
      // lọc tên/mã
      if (tokenized.length === 0) return true;
      const haystack = norm(`${item.ten ?? ""} ${item.ma ?? ""}`);
      return tokenized.every((tok) => haystack.includes(tok));
    });
  }, [kichThuoc, statusWatch, tokenized]);

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
      sorter: (a, b) => (parseInt(a.ten, 10) || 0) - (parseInt(b.ten, 10) || 0),
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
            <GoNumber size={35} /> Quản lý kích thước
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
                    loadKichThuoc();
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
              <PlusCircleOutlined /> Thêm kích thước
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
            <BookFilled size={30} /> Danh sách kích thước
          </h5>
          <hr />
          <div className="ms-3">
            {/* Modal Thêm  */}
            <Modal
              title="Thêm Kích Thước"
              centered
              open={open}
              onCancel={() => setOpen(false)}
              footer={null}
              width={500}
            >
              <Form
                form={form}
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{ maxWidth: 1000 }}
                onFinish={addKichThuoc}
              >
                <Form.Item
                  label="Tên"
                  name="ten"
                  hasFeedback
                  rules={[{ required: true, validator: validateDateKichThuoc }]}
                >
                  <Input maxLength={10} className="border" />
                </Form.Item>
                <div className="text-end">
                  <Button onClick={() => setOpen(false)} className="me-2">
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Thêm
                  </Button>
                </div>
              </Form>
            </Modal>

            {/* Modal Sửa */}
            <Modal
              title="Sửa kích thước"
              centered
              open={openUpdate}
              onCancel={() => setOpenUpdate(false)}
              footer={null}
              width={500}
            >
              <Form
                {...formItemLayout}
                form={form1}
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{ maxWidth: 1000 }}
                onFinish={updateKichThuoc}
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
                    value={ktUpdate?.ten}
                    onChange={(e) =>
                      setKtUpdate({ ...ktUpdate, ten: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item name="trangThai" label={<b>Trạng thái</b>}>
                  <Radio.Group
                    value={ktUpdate?.trangThai}
                    onChange={(e) =>
                      setKtUpdate({ ...ktUpdate, trangThai: e.target.value })
                    }
                  >
                    <Radio value={0}>Còn bán</Radio>
                    <Radio value={1}>Dừng bán</Radio>
                  </Radio.Group>
                </Form.Item>
                <div className="text-end">
                  <Button onClick={() => setOpenUpdate(false)} className="me-2">
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Sửa
                  </Button>
                </div>
              </Form>
            </Modal>
          </div>

          <div className="container-fluid mt-4">
            <Table
              className="text-center"
              dataSource={filteredKichThuoc}
              columns={columns}
              rowKey={(r) => r.id}
              pagination={{
                showQuickJumper: true,
                defaultPageSize: 5,
                position: ["bottomCenter"],
                defaultCurrent: 1,
                total: filteredKichThuoc.length,
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
