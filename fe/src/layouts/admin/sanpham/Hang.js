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

  // ==== Add ====
  const addHang = (value) => {
    const exists = hang.some((h) => norm(h.ten) === norm(value.ten || ""));
    if (exists) {
      toast.error("Hãng đã tồn tại!", { autoClose: 3000, theme: "light" });
      return;
    }
    ThuocTinhAPI.create("hang", value).then(() => {
      toast.success("✔️ Thêm thành công!", { autoClose: 3000, theme: "light" });
      loadHang();
      setOpen(false);
      form.resetFields();
    });
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

  // ==== Update ====
  const updateHang = () => {
    if (hangUpdate.ten !== tenCheck) {
      const exists = hang.some(
        (x) => norm(x.ten) === norm(hangUpdate.ten || "")
      );
      if (exists) {
        toast.error("Hãng trùng với hãng khác!", {
          autoClose: 3000,
          theme: "light",
        });
        return;
      }
    }
    ThuocTinhAPI.update("hang", hangUpdate.id, hangUpdate).then(() => {
      toast.success("✔️ Sửa thành công!", { autoClose: 3000, theme: "light" });
      setHangUpdate("");
      loadHang();
      setOpenUpdate(false);
    });
  };

  // ==== Validate ====
  const validateDateHang = () => {
    const ten = (form.getFieldValue("ten") || "").trim();
    if (!ten) return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(ten))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };

  const validateDateHangUpdate = () => {
    const ten = (form1.getFieldValue("ten") || "").trim();
    if (!ten) return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(ten))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
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
            <Modal
              title="Thêm Hãng"
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
                onFinish={addHang}
              >
                <Form.Item
                  label="Tên"
                  name="ten"
                  hasFeedback
                  rules={[{ required: true, validator: validateDateHang }]}
                >
                  <Input maxLength={31} className="border" />
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

            {/* Modal Update  */}
            <Modal
              title="Sửa hãng"
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
                onFinish={updateHang}
              >
                <Form.Item
                  name="ten"
                  label={<b>Tên</b>}
                  hasFeedback
                  rules={[
                    { required: true, validator: validateDateHangUpdate },
                  ]}
                >
                  <Input
                    className="border"
                    maxLength={31}
                    value={hangUpdate?.ten}
                    onChange={(e) =>
                      setHangUpdate({ ...hangUpdate, ten: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item name="trangThai" label={<b>Trạng thái</b>}>
                  <Radio.Group
                    value={hangUpdate?.trangThai}
                    onChange={(e) =>
                      setHangUpdate({
                        ...hangUpdate,
                        trangThai: e.target.value,
                      })
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
