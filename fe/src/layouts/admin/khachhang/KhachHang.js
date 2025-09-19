import "./khachhang.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Divider,
  Select,
  Space,
  Table,
  Tag,
  Image,
} from "antd";
import { FilterFilled } from "@ant-design/icons";
import { BsPencilSquare } from "react-icons/bs";
import { PlusCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { BiSolidUserBadge } from "react-icons/bi";
import { GrMapLocation } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import ModalDiaChi from "./ModalDiaChi";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";
export default function KhachHang() {
  const [idKH, setIdKH] = useState("");
  const [componentSize] = useState("default");
  const nav = useNavigate();
  const [openModalDiaChi, setOpenModalDiaChi] = useState(false);
  const [form] = Form.useForm();

  const [khachHang, setKhachHang] = useState([]); // dữ liệu gốc
  const [filteredKH, setFilteredKH] = useState([]); // dữ liệu sau lọc

  useEffect(() => {
    loadKhachHang();
  }, []);

  const loadKhachHang = () => {
        NguoiDungAPI.getAll("khach-hang")
          .then((res) => {
            setKhachHang(res.data);
            setFilteredKH(res.data); // hiển thị ban đầu = toàn bộ
          })
          .catch((err) => {
            toast.error("Tải danh sách khách hàng thất bại!");
            console.error(err);
          });
  };

  // Lọc + tìm kiếm local
  const onChangeFilter = (changedValues, allValues) => {
    let data = [...khachHang];

    // Tìm theo tên, mã hoặc SĐT
    if (allValues.tenTimKiem) {
      const keyword = allValues.tenTimKiem.trim().toLowerCase();
      data = data.filter(
        (kh) =>
          kh.ma.toLowerCase().includes(keyword) ||
          kh.ten.toLowerCase().includes(keyword) ||
          kh.soDienThoai.toLowerCase().includes(keyword)
      );
    }

    // Lọc theo trạng thái
    if (allValues.trangThai !== undefined) {
      data = data.filter(
        (kh) => kh.trangThai.toString() === allValues.trangThai
      );
    }

    setFilteredKH(data);
  };

  const themKH = () => {
    nav("/admin-them-khach-hang");
  };

  const detailDiaChi = (row) => {
    setIdKH(row);
    setOpenModalDiaChi(true);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "anh",
      align: "center",
      render: (text) => (
        <Image
          width={100}
          height={100}
          style={{ borderRadius: "15px" }}
          src={text}
        />
      ),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "ma",
      sorter: (a, b) => a.ma.localeCompare(b.ma),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "ten",
      sorter: (a, b) => a.ten.localeCompare(b.ten),
    },
    {
      title: "CCCD",
      dataIndex: "cccd",
      sorter: (a, b) => a.cccd.localeCompare(b.cccd),
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDienThoai",
      sorter: (a, b) => a.soDienThoai.localeCompare(b.soDienThoai),
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (gioiTinh) =>
        gioiTinh === "true" ? (
          <Tag color="blue">Nam</Tag>
        ) : (
          <Tag color="red">Nữ</Tag>
        ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      render: (ngaySinh) => <>{new Date(ngaySinh * 1).toLocaleDateString()}</>,
      sorter: (a, b) => a.ngaySinh - b.ngaySinh,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      filters: [
        { text: "Hoạt động", value: "0" },
        { text: "Không Hoạt động", value: "1" },
      ],
      onFilter: (value, record) => record.trangThai.toString() === value,
      render: (trangThai) =>
        trangThai === 1 ? (
          <Tag color="red">Không hoạt động</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "id",
      align: "center",
      render: (id) => (
        <Space size="middle">
          <Link
            to={`/admin-update-khach-hang/${id}`}
            className="btn btn-danger"
          >
            <BsPencilSquare />
          </Link>
          <Button
            style={{
              width: 41,
              height: 37.6,
              backgroundColor: "#35afb1",
              color: "white",
            }}
            onClick={() => detailDiaChi(id)}
          >
            <GrMapLocation />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <Divider orientation="center">
        <h2 className="text-first pt-1 fw-bold">
          <BiSolidUserBadge /> Quản lý khách hàng
        </h2>
      </Divider>

      <div
        className="bg-light m-2 p-3 pt-2"
        style={{
          border: "1px solid #ddd",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <h4 className="text-start">
          <FilterFilled size={30} /> Bộ lọc
        </h4>
        <hr />
        <Form
          className="row"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onValuesChange={onChangeFilter}
          size={componentSize}
          form={form}
        >
          <div className="col-md-5">
            <Form.Item label="Tìm kiếm" name="tenTimKiem">
              <Input maxLength={30} placeholder="Nhập mã, tên hoặc SĐT..." />
            </Form.Item>
          </div>
          <div className="col-md-5">
            <Form.Item label="Trạng thái" name="trangThai">
              <Select allowClear>
                <Select.Option value="0">Hoạt động</Select.Option>
                <Select.Option value="1">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
        <Form.Item className="text-center">
          <Button className="btn3" htmlType="reset" onClick={loadKhachHang}>
            Làm mới
          </Button>
        </Form.Item>
      </div>

      <div className="text-end mt-3">
        <button onClick={themKH} className="button-them">
          <span className="text">
            <PlusCircleOutlined /> Thêm khách hàng
          </span>
        </button>
      </div>

      <div className="container-fluid mt-4">
        <Table
          dataSource={filteredKH}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            position: ["none", "bottomCenter"],
            defaultPageSize: 5,
          }}
          rowKey="id"
        />
      </div>

      {idKH && (
        <ModalDiaChi
          openModalDiaChi={openModalDiaChi}
          setOpenModalDiaChi={setOpenModalDiaChi}
          idKH={idKH}
          setIdKH={setIdKH}
        />
      )}
    </div>
  );
}
