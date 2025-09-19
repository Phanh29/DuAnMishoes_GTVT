import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import {
  FilterFilled,
  RetweetOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { BsFillEyeFill } from "react-icons/bs";
import { FaMoneyBills } from "react-icons/fa6";
import moment from "moment";
import { HoaDonAPI } from "../../../pages/api/hoadon/HoaDonAPI";

// Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu
const stripVN = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

// dayjs/Date/number -> moment (hoặc null)
const toMoment = (d) => (d ? moment(d.valueOf ? d.valueOf() : d) : null);

export default function HoaDon() {
  const [form] = Form.useForm();
  const [componentSize] = useState("default");

  // Dữ liệu gốc từ API (đọc 1 lần)
  const [raw, setRaw] = useState([]);

  // Giá trị filter từ form
  const [filters, setFilters] = useState({
    tenHD: "",
    loaiHD: undefined,
    ngayBDHD: null, // dayjs
    ngayKTHD: null, // dayjs
  });

  // Tải tất cả hoá đơn (1 API duy nhất)
  const loadAll = async () => {
    const all = await HoaDonAPI.getAll().then((r) => r?.data || []);
    setRaw(all);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Dữ liệu sau khi lọc client-side
  const filteredAll = useMemo(() => {
    const kw = stripVN((filters.tenHD || "").trim().toLowerCase());
    const loaiHD = filters.loaiHD;

    const start = toMoment(filters.ngayBDHD)?.startOf("day") ?? null;
    const end = toMoment(filters.ngayKTHD)?.endOf("day") ?? null;

    return (raw || []).filter((it) => {
      // Từ khoá: ma / tenKH / sdt
      if (kw) {
        const hay = stripVN(
          `${it.ma ?? ""} ${it.tenKH ?? ""} ${it.sdt ?? ""}`
        ).toLowerCase();
        if (!hay.includes(kw)) return false;
      }

      // Loại hoá đơn
      if (loaiHD !== undefined && loaiHD !== null && loaiHD !== "") {
        if (String(it.loaiHD) !== String(loaiHD)) return false;
      }

      // Ngày
      const mua = moment(it.ngayMua);
      if (!mua.isValid()) return false;
      if (start && mua.isBefore(start)) return false;
      if (end && mua.isAfter(end)) return false;

      return true;
    });
  }, [raw, filters]);

  // Gom theo trạng thái (từ dữ liệu đã lọc)
  const byStatus = useMemo(() => {
    const m = { "-1": [], 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 10: [] };
    (filteredAll || []).forEach((it) => {
      const k = String(it.trangThai);
      if (m[k]) m[k].push(it);
    });
    return m;
  }, [filteredAll]);

  // Columns bảng
  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "id",
        key: "stt",
        align: "center",
        render: (_id, _record, index) => index + 1,
        showSorterTooltip: false,
      },
      {
        title: "Mã hóa đơn",
        dataIndex: "ma",
        align: "center",
        sorter: (a, b) =>
          String(a?.ma ?? "").localeCompare(String(b?.ma ?? "")),
      },
      {
        title: "Mã NV",
        dataIndex: "maNV",
        align: "center",
      },
      {
        title: "Khách hàng",
        dataIndex: "tenKH",
      },
      {
        title: "SDT KH",
        dataIndex: "sdt",
        align: "center",
      },
      {
        title: "Loại HĐ",
        dataIndex: "loaiHD",
        key: "loaiHD",
        align: "center",
        render: (val) =>
          Number(val) === 0 ? (
            <Tag color="#00cc00">Online</Tag>
          ) : (
            <Tag color="#FFD700">Tại quầy</Tag>
          ),
        filters: [
          { text: "Online", value: 0 },
          { text: "Tại quầy", value: 1 },
        ],
        onFilter: (val, record) => String(record.loaiHD) === String(val),
      },
      {
        title: "Ngày mua",
        dataIndex: "ngayMua",
        align: "center",
        render: (ngayMua) => moment(ngayMua).format("HH:mm:ss DD/MM/YYYY"),
        sorter: (a, b) =>
          moment(a.ngayMua).valueOf() - moment(b.ngayMua).valueOf(),
      },
      {
        title: "Thành tiền",
        dataIndex: "thanhTien",
        align: "right",
        render: (val) =>
          (Number(val) || 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
          }),
        sorter: (a, b) =>
          (Number(a.thanhTien) || 0) - (Number(b.thanhTien) || 0),
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        align: "center",
        render: (st) =>
          Number(st) === 0 ? (
            <Tag color="red">Chờ xác nhận</Tag>
          ) : Number(st) === 1 ? (
            <Tag color="purple">Xác nhận</Tag>
          ) : Number(st) === 2 ? (
            <Tag color="geekblue">Chờ vận chuyển</Tag>
          ) : Number(st) === 3 ? (
            <Tag color="blue">Vận chuyển</Tag>
          ) : Number(st) === 4 ? (
            <Tag color="cyan">Thanh toán</Tag>
          ) : Number(st) === 5 ? (
            <Tag color="green">Hoàn thành</Tag>
          ) : Number(st) === -1 ? (
            <Tag color="#cd201f">Hủy</Tag>
          ) : Number(st) === 10 ? (
            <Tag color="#cd201f">Trả hàng</Tag>
          ) : (
            <Tag color="gold">Đã thanh toán</Tag>
          ),
        filters: [
          { text: "Chờ xác nhận", value: 0 },
          { text: "Xác nhận", value: 1 },
          { text: "Chờ vận chuyển", value: 2 },
          { text: "Vận chuyển", value: 3 },
          { text: "Thanh toán", value: 4 },
          { text: "Hoàn thành", value: 5 },
          { text: "Hủy", value: -1 },
          { text: "Trả hàng", value: 10 },
        ],
        onFilter: (val, record) => String(record.trangThai) === String(val),
      },
      {
        title: "Hành động",
        key: "action",
        align: "center",
        render: (_text, record) => (
          <Space size="middle">
            <Link
              to={`/admin-detail-hoa-don/${record.idHD}`}
              state={{ hoaDon: record }} // ✅ vẫn đẩy qua state
              onClick={() =>
                sessionStorage.setItem("hoaDonDetail", JSON.stringify(record))
              } // ✅ backup để F5 không mất
              className="btn btn-danger"
            >
              <BsFillEyeFill />
            </Link>
          </Space>
        ),
      },
    ],
    []
  );

  // Tabs (dựa trên dữ liệu đã lọc)
  const tabs = useMemo(() => {
    const makeTable = (data) => (
      <Table
        rowKey={(r) => r.idHD ?? r.id ?? Math.random()} // ✅ ưu tiên idHD
        dataSource={data}
        columns={columns}
        pagination={{
          showQuickJumper: true,
          position: ["bottomCenter"],
          defaultPageSize: 5,
        }}
      />
    );

    return [
      { key: "1", label: "Tất cả", children: makeTable(filteredAll) },
      {
        key: "2",
        label: <Badge count={byStatus["0"]?.length || 0}>Chờ xác nhận</Badge>,
        children: makeTable(byStatus["0"]),
      },
      {
        key: "3",
        label: <Badge count={byStatus["1"]?.length || 0}>Xác nhận</Badge>,
        children: makeTable(byStatus["1"]),
      },
      {
        key: "4",
        label: <Badge count={byStatus["2"]?.length || 0}>Chờ vận chuyển</Badge>,
        children: makeTable(byStatus["2"]),
      },
      {
        key: "5",
        label: <Badge count={byStatus["3"]?.length || 0}>Vận chuyển</Badge>,
        children: makeTable(byStatus["3"]),
      },
      {
        key: "6",
        label: <Badge count={byStatus["4"]?.length || 0}>Thanh toán</Badge>,
        children: makeTable(byStatus["4"]),
      },
      { key: "7", label: "Hoàn thành", children: makeTable(byStatus["5"]) },
      {
        key: "8",
        label: "Hủy",
        children: makeTable(byStatus["-1"]),
      },
      {
        key: "9",
        label: "Trả hàng",
        children: makeTable(byStatus["10"]),
      },
    ];
  }, [filteredAll, byStatus, columns]);

  // Reset filter
  const handleReset = async () => {
    form.resetFields();
    setFilters({
      tenHD: "",
      loaiHD: undefined,
      ngayBDHD: null,
      ngayKTHD: null,
    });
    await loadAll();
  };

  return (
    <div className="container-fluid">
      <Divider orientation="center" color="none">
        <h2 className="text-start pt-1 fw-bold">
          <FaMoneyBills /> Quản lý hóa đơn
        </h2>
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
        <h5 className="text-start">
          <FilterFilled /> Bộ lọc
        </h5>
        <hr />
        <Form
          form={form}
          className="row col-md-12"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={(_, all) => setFilters(all)}
          size={componentSize}
          style={{ maxWidth: 1600 }}
        >
          <div className="col-md-6">
            <Form.Item label="Tìm kiếm" name="tenHD">
              <Input
                maxLength={30}
                placeholder="Mã HĐ / Khách hàng / SĐT ..."
                allowClear
              />
            </Form.Item>

            <Form.Item label="Loại HD" name="loaiHD">
              <Select allowClear placeholder="Chọn loại hóa đơn">
                <Select.Option value={1}>Tại quầy</Select.Option>
                <Select.Option value={0}>Online</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Ngày bắt đầu" name="ngayBDHD">
              <DatePicker allowClear style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ngày kết thúc" name="ngayKTHD">
              <DatePicker
                allowClear
                style={{ width: "100%" }}
                // không cho chọn ngày kết thúc < ngày bắt đầu
                disabledDate={(cur) => {
                  const start = form.getFieldValue("ngayBDHD");
                  return start
                    ? cur && cur.valueOf() < start.startOf("day").valueOf()
                    : false;
                }}
              />
            </Form.Item>
          </div>

          <Form.Item className="d-flex justify-content-center">
            <Button
              type="primary"
              htmlType="reset"
              onClick={handleReset}
              icon={<RetweetOutlined />}
            >
              Làm mới
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Danh sách */}
      <div
        className="mt-4"
        style={{
          border: "1px solid #ddd",
          boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <div className="text-start fw-bold">
          <p>
            <UnorderedListOutlined /> Danh sách hóa đơn
          </p>
        </div>

        <Tabs defaultActiveKey="1" items={tabs} />
      </div>
    </div>
  );
}
