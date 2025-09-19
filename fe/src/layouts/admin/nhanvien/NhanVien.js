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
import { Link, useNavigate } from "react-router-dom";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";
import "../khachhang/khachhang.css";

export default function NhanVien() {
  const [componentSize] = useState("default");
  const nav = useNavigate();
  const [form] = Form.useForm();

  const [nhanVien, setNhanVien] = useState([]); // dữ liệu gốc
  const [filteredNV, setFilteredNV] = useState([]); // dữ liệu đã lọc

  useEffect(() => {
    loadNhanVien();
  }, []);

  const loadNhanVien = () => {
    NguoiDungAPI.getAll("nhan-vien")
      .then((res) => {
        setNhanVien(res.data);
        setFilteredNV(res.data); // ban đầu hiển thị toàn bộ
        form.resetFields()
      })
      .catch((err) => {
        toast.error("Tải danh sách nhân viên thất bại!");
        console.error(err);
      });
  };

  // --- Lọc và tìm kiếm trong bộ nhớ
  const onChangeFilter = (changedValues, allValues) => {
    let data = [...nhanVien];

    // Tìm kiếm theo mã, tên hoặc SĐT
    if (allValues.tenTimKiem) {
      const keyword = allValues.tenTimKiem.trim().toLowerCase();
      data = data.filter(
        (nv) =>
          nv.ma.toLowerCase().includes(keyword) ||
          nv.ten.toLowerCase().includes(keyword) ||
          nv.soDienThoai.toLowerCase().includes(keyword)
      );
    }

    // Lọc theo trạng thái
    if (allValues.trangThai !== undefined) {
      data = data.filter(
        (nv) => nv.trangThai.toString() === allValues.trangThai
      );
    }

    setFilteredNV(data);
  };

  const themNV = () => {
    nav("/admin-them-nhan-vien");
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => index + 1,
      showSorterTooltip: false,
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
      title: "Mã nhân viên",
      dataIndex: "ma",
      sorter: (a, b) => a.ma.localeCompare(b.ma),
    },
    {
      title: "Tên nhân viên",
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
          <Link to={`/admin-update-nhan-vien/${id}`} className="btn btn-danger">
            <BsPencilSquare />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <Divider orientation="center">
        <h2 className="text-first pt-1 fw-bold">
          <BiSolidUserBadge /> Quản lý nhân viên
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
          initialValues={{ size: componentSize }}
          onValuesChange={onChangeFilter}
          size={componentSize}
          form={form}
        >
          <div className="col-md-5">
            <Form.Item label="Tìm kiếm" name="tenTimKiem">
              <Input
                maxLength={30}
                placeholder="Nhập mã hoặc tên hoặc SĐT..."
              />
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
          <Button className="btn3" htmlType="reset" onClick={loadNhanVien}>
            Làm mới
          </Button>
        </Form.Item>
      </div>

      <div className="text-end mt-3">
        <button onClick={themNV} className="button-them">
          <span className="text">
            <PlusCircleOutlined /> Thêm nhân viên
          </span>
        </button>
      </div>

      <div className="container-fluid mt-4">
        <Table
          dataSource={filteredNV}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            position: ["none", "bottomCenter"],
            defaultPageSize: 5,
          }}
          rowKey="id"
        />
      </div>
    </div>
  );
}
