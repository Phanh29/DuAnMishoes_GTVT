import React, { useState, useEffect, useMemo } from "react";
import {
  Space,
  Table,
  Tag,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Divider,
  Modal,
} from "antd";
import {
  PlusCircleOutlined,
  FilterFilled,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { LuBadgePercent } from "react-icons/lu";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DotGiamGiaAPI } from "../../../pages/api/dotgiamgia/DotGiamGiaAPI";
import { BsFillEyeFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  GetInvoice,
  UpdateKMInvoice,
  UpdateKMNULLInvoice,
} from "../store/reducer/DetailInvoice.reducer";
import { dispatch } from "../store/redux/store";
import { Update } from "../store/reducer/Bill.reducer";

const DotGiamGia = () => {
  const currentTime = moment();
  const nav = useNavigate();

  // navigation
  const themKM = () => nav("/admin-them-dot-giam-gia");

  // redux selector (used for invoice updates later)
  const ctspHD = useSelector(GetInvoice);

  // form state & selectedValue for conditional input
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState(""); // "" = Tất cả

  // data: khuyenMaiAll = original full list from API; khuyenMai = filtered list shown
  const [khuyenMaiAll, setKhuyenMaiAll] = useState([]);
  const [khuyenMai, setKhuyenMai] = useState([]);

  // dataSearch stores current filters from Form
  const [dataSearch, setDataSearch] = useState({});

  // load all promotions once
  const loadKhuyenMai = async () => {
    try {
      const resp = await DotGiamGiaAPI.getAll();
      const data = resp.data || [];
      setKhuyenMaiAll(data);
      setKhuyenMai(data);
    } catch (err) {
      console.error("Load promotions error:", err);
    }
  };

  useEffect(() => {
    loadKhuyenMai();
  }, []);

  // helper: apply client-side filter to khuyenMaiAll
  const applyFilters = (all, filters) => {
    // normalize filter values
    const fMa = filters.ma ? String(filters.ma).trim().toLowerCase() : "";
    const fTen = filters.ten ? String(filters.ten).trim().toLowerCase() : "";
    const fLoai = filters.loai ? String(filters.loai).trim() : "";
    const fGia =
      filters.gia_tri_khuyen_mai !== undefined &&
      filters.gia_tri_khuyen_mai !== null
        ? Number(filters.gia_tri_khuyen_mai)
        : null;
    // DatePickers return moment objects from antd.
    const fNgayBD = filters.ngay_bat_dau ? moment(filters.ngay_bat_dau) : null;
    const fNgayKT = filters.ngay_ket_thuc
      ? moment(filters.ngay_ket_thuc)
      : null;

    return all.filter((item) => {
      // mã (contains)
      if (
        fMa &&
        !String(item.ma || "")
          .toLowerCase()
          .includes(fMa)
      )
        return false;
      // tên (contains)
      if (
        fTen &&
        !String(item.ten || "")
          .toLowerCase()
          .includes(fTen)
      )
        return false;
      // loại (exact)
      if (fLoai && fLoai !== "" && String(item.loai || "") !== fLoai)
        return false;
      // giá trị giảm (match numeric)
      if (fGia !== null && Number(item.gia_tri_khuyen_mai) !== fGia)
        return false;
      // ngày bắt đầu (record.ngay_bat_dau >= filter.ngay_bat_dau)
      if (fNgayBD) {
        const recBD = item.ngay_bat_dau ? moment(item.ngay_bat_dau) : null;
        if (!recBD || recBD.isBefore(fNgayBD, "second")) return false;
      }
      // ngày kết thúc (record.ngay_ket_thuc <= filter.ngay_ket_thuc)
      if (fNgayKT) {
        const recKT = item.ngay_ket_thuc ? moment(item.ngay_ket_thuc) : null;
        if (!recKT || recKT.isAfter(fNgayKT, "second")) return false;
      }

      return true;
    });
  };

  // called when form values change (client-side)
  const onChangeFilter = (changedValues, allValues) => {
    // normalize string inputs
    if (allValues.hasOwnProperty("ma") && allValues.ma) {
      allValues.ma = String(allValues.ma).trim();
    }
    setDataSearch(allValues);
    // keep selectedValue in sync with loai select to control InputNumber rendering
    setSelectedValue(allValues.loai || "");
    // apply filter locally
    const filtered = applyFilters(khuyenMaiAll, allValues);
    setKhuyenMai(filtered);
  };

  // update trạng thái -> keep using API to toggle open/close promotions
  const updateTrangThai = async (id, value) => {
    try {
      const response = await DotGiamGiaAPI.updateClosePromotion(id, value);
      // dispatch redux updates (kept behavior)
      dispatch(
        UpdateKMNULLInvoice({ tenKM: response.ten, loaiKM: response.loai })
      );
      if (response.status === 200 || response.status === "200") {
        await loadKhuyenMai();
        toast.success("Cập nhật thành công!");
      }
    } catch (err) {
      console.error("Update close promotion error:", err);
      toast.error("Cập nhật thất bại");
    }
    // cập nhật thanh tien theo ctspHD
    updateInvoiceTotalsFromCtspHD();
  };

  const updateTrangThai1 = async (id, value) => {
    try {
      const response = await DotGiamGiaAPI.updateOpenPromotion(id, value);
      dispatch(
        UpdateKMInvoice({
          tenKM: response.ten,
          loaiKM: response.loai,
          giaTriKhuyenMai: response.gia_tri_khuyen_mai,
        })
      );
      if (response.status === 200 || response.status === "200") {
        await loadKhuyenMai();
        toast.success("Cập nhật thành công!");
      }
    } catch (err) {
      console.error("Update open promotion error:", err);
      toast.error("Cập nhật thất bại");
    }
    updateInvoiceTotalsFromCtspHD();
  };

  // helper to update invoice totals from ctspHD (kept behavior but simplified)
  const updateInvoiceTotalsFromCtspHD = () => {
    const itemsMap = {};
    ctspHD.forEach((item) => {
      if (!itemsMap[item.hoaDon]) itemsMap[item.hoaDon] = 0;
      itemsMap[item.hoaDon] += Number(item.total || 0);
    });
    Object.keys(itemsMap).forEach((hoaDon) => {
      dispatch(Update({ key: hoaDon, thanhTien: itemsMap[hoaDon] }));
    });
  };

  // Table columns (kept mostly same, but some minor fixes)
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => index + 1,
    },
    {
      title: "Mã",
      dataIndex: "ma",
    },
    {
      title: "Tên",
      dataIndex: "ten",
    },
    {
      title: "Loại",
      dataIndex: "loai",
      key: "loai",
      filters: [
        { text: "Tiền mặt", value: "Tiền mặt" },
        { text: "Phần trăm", value: "Phần trăm" },
      ],
      onFilter: (value, record) =>
        String(record.loai || "").indexOf(value) === 0,
    },
    {
      title: "Giá trị giảm",
      dataIndex: "gia_tri_khuyen_mai",
      key: "gia_tri_khuyen_mai",
      render: (gia_tri_khuyen_mai, x) =>
        x.loai && x.loai.toLowerCase().includes("tiền")
          ? new Intl.NumberFormat("vi-VI", { maximumFractionDigits: 0 }).format(
              gia_tri_khuyen_mai
            ) + " VND"
          : gia_tri_khuyen_mai + "%",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngay_bat_dau",
      render: (ngay_bat_dau) =>
        moment(ngay_bat_dau).format("DD/MM/YYYY, HH:mm:ss"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngay_ket_thuc",
      render: (ngay_ket_thuc) =>
        moment(ngay_ket_thuc).format("DD/MM/YYYY, HH:mm:ss"),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) => {
        if (trangThai === 0) return <Tag color="#f50">Sắp diễn ra</Tag>;
        if (trangThai === 1) return <Tag color="#87d068">Đang diễn ra</Tag>;
        if (trangThai === 2) return <Tag color="#ff0000">Đã kết thúc</Tag>;
        return <Tag color="#000000">Tạm dừng</Tag>;
      },
      filters: [
        { text: "Sắp diễn ra", value: 0 },
        { text: "Đang diễn ra", value: 1 },
        { text: "Đã kết thúc", value: 2 },
        { text: "Tạm dừng", value: 3 },
      ],
      onFilter: (value, record) => record.trangThai === parseInt(value),
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Link
            to={`/admin-sua-khuyen-mai/${record.id}`}
            className="btn btn-danger"
          >
            <BsFillEyeFill size={20} />
          </Link>

          {moment(record.ngay_ket_thuc).isAfter(currentTime) ? (
            record.trangThai === 3 ? (
              <a
                className="btn rounded-pill"
                onClick={() =>
                  Modal.confirm({
                    title: "Thông báo",
                    content: "Bạn có chắc chắn muốn sửa không?",
                    onOk: () => updateTrangThai1(record.id, record),
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  })
                }
              >
                <PlayCircleOutlined
                  style={{
                    fontSize: 30,
                    backgroundColor: "#ffff00",
                    borderRadius: 90,
                  }}
                />
              </a>
            ) : (
              <a
                className="btn rounded-pill"
                onClick={() =>
                  Modal.confirm({
                    title: "Thông báo",
                    content: "Bạn có chắc chắn muốn sửa không?",
                    onOk: () => updateTrangThai(record.id, record),
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  })
                }
              >
                <PauseCircleOutlined
                  style={{
                    fontSize: 30,
                    backgroundColor: "#ffff00",
                    borderRadius: 90,
                  }}
                />
              </a>
            )
          ) : (
            <a className="btn rounded-pill" disabled>
              <PlayCircleOutlined
                style={{
                  fontSize: 30,
                  backgroundColor: "#ffff00",
                  borderRadius: 90,
                }}
              />
            </a>
          )}
        </Space>
      ),
    },
  ];

  // memoized sorted dataSource (sorted by ngayTao desc)
  const dataSource = useMemo(() => {
    return [...khuyenMai].sort((a, b) => {
      const dateA = new Date(a.ngayTao || a.createdAt || 0);
      const dateB = new Date(b.ngayTao || b.createdAt || 0);
      return dateB - dateA;
    });
  }, [khuyenMai]);

  return (
    <div>
      <div className="container-fluid">
        <Divider orientation="center" color="none">
          <h2 className="text-first pt-1 fw-bold">
            <LuBadgePercent /> Quản lý đợt giảm giá
          </h2>
        </Divider>

        <div className="bg-light m-2 p-3" style={{ borderRadius: 20 }}>
          <div className="text-first fw-bold">
            <FilterFilled /> Bộ lọc
          </div>
          <hr />
          <Form
            className=" row col-md-12"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onValuesChange={onChangeFilter}
            size="default"
            style={{ maxWidth: 1600 }}
            form={form}
          >
            <div className="col-md-4">
              <Form.Item label="Mã KM" name="ma">
                <Input
                  maxLength={30}
                  placeholder="Mã khuyến mại"
                  className="rounded-pill border-warning"
                />
              </Form.Item>
              <Form.Item label="Loại" name="loai">
                <select
                  value={selectedValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedValue(v);
                    // update the form field so form.onValuesChange triggers
                    form.setFieldsValue({ loai: v });
                  }}
                  className="rounded-pill border-warning"
                >
                  <option value="">Tất cả</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Phần trăm">Phần trăm</option>
                </select>
              </Form.Item>
            </div>

            <div className="col-md-4">
              <Form.Item label="Tên KM" name="ten">
                <Input
                  placeholder="Tên khuyến mại"
                  className="rounded-pill border-warning"
                />
              </Form.Item>
              <Form.Item label="Giá trị giảm" name="gia_tri_khuyen_mai">
                {selectedValue === "Tiền mặt" ? (
                  <InputNumber
                    defaultValue={0}
                    formatter={(value) =>
                      `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    className="rounded-pill border-warning"
                  />
                ) : selectedValue === "Phần trăm" ? (
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                    style={{ width: "100%" }}
                    className="rounded-pill border-warning"
                  />
                ) : (
                  <Input className="rounded-pill border-warning" disabled />
                )}
              </Form.Item>
            </div>

            <div className="col-md-4">
              <Form.Item label="Ngày bắt đầu" name="ngay_bat_dau">
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder="Ngày bắt đầu"
                  format="YYYY-MM-DD HH:mm:ss"
                  className="rounded-pill border-warning"
                />
              </Form.Item>
              <Form.Item label="Ngày kết thúc" name="ngay_ket_thuc">
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder="Ngày kết thúc"
                  format="YYYY-MM-DD HH:mm:ss"
                  className="rounded-pill border-warning"
                />
              </Form.Item>
            </div>

            <div className="col-md-4" />
            <div className="col-md-1" />
            <div className="col-md-4">
              <Form.Item className="text-center">
                <button
                  type="button"
                  className="btn btn-warning nut-tim-kiem rounded-pill fw-bold"
                  onClick={() => {
                    form.resetFields();
                    setSelectedValue("");
                    setDataSearch({});
                    setKhuyenMai(khuyenMaiAll);
                  }}
                >
                  <ReloadOutlined />
                  Làm mới
                </button>
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className="text-end">
          <br />
          <button onClick={themKM} className="button-them">
            <span className="text">
              <PlusCircleOutlined /> Thêm đợt giảm giá 
            </span>
          </button>
        </div>

        <div className="text-first fw-bold">
          <p>
            <UnorderedListOutlined /> Danh sách đợt giảm giá
          </p>
        </div>
        <hr />

        <div className="container-fluid mt-4">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={(r) => r.id || r.ma}
            pagination={{
              showQuickJumper: true,
              defaultCurrent: 1,
              defaultPageSize: 5,
              pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
              showSizeChanger: true,
              total: khuyenMai.length,
            }}
          />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="light" />
    </div>
  );
};

export default DotGiamGia;
