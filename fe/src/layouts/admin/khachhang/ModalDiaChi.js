import { Button, Modal, Table, Tag, Radio, Space } from "antd";
import React, { useState, useEffect } from "react";
import AddModalDiaChi from "./AddModalDiaChi";
import ModalUpdateDiaChi from "./ModalUpdateDiaChi";
import { toast } from "react-toastify";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";
const ModalDiaChi = (props) => {
  const { openModalDiaChi, setOpenModalDiaChi, idKH } = props;
  const [nowAddress, setNowAddress] = useState("");
  const [datas, setData] = useState([]);
  const [openModalAddDiaChi, setOpenModalAddDiaChi] = useState(false);
  const [openModalUpdateDiaChi, setOpenModalUpdateDiaChi] = useState(false);
  const [diaChiUpdate, setDiaChiUpdate] = useState({});

  const handleClose = () => setOpenModalDiaChi(false);

  const handleUpdateTT = () => {
    if (!nowAddress) {
      toast.error("Vui lòng chọn địa chỉ mặc định trước khi lưu!");
      return;
    }
    NguoiDungAPI.updateDiaChiMacDinh(nowAddress)
      .then(() => {
        toast.success("Cập nhật địa chỉ mặc định thành công!");
        loadDiaChi();
        handleClose();
      })
      .catch(() => {
        toast.error("Cập nhật địa chỉ mặc định thất bại!");
      });
  };

  const handleOpenADDModalDiaChi = () => setOpenModalAddDiaChi(true);

  const handleOpenUpdateDiaChi = (value) => {
    setDiaChiUpdate(value);
    setOpenModalUpdateDiaChi(true);
  };

  const loadDiaChi = () => {
    if (!idKH) return;
    NguoiDungAPI.getDiaChiByKH(idKH)
      .then((result) => {
        setData(result.data);
        const macDinh = result.data.find((item) => item.trangThai === 0);
        if (macDinh) {
          setNowAddress(macDinh.id);
        } else {
          setNowAddress("");
        }
      })
      .catch(() => {
        toast.error("Lỗi tải địa chỉ!");
      });
  };

  useEffect(() => {
    if (idKH) {
      loadDiaChi();
    }
  }, [idKH]);

  const dataSource = datas.map((item) => ({
    key: item.id,
    ...item,
  }));

  const columns = [
    {
      render: (_, record) => (
        <Radio
          checked={nowAddress === record.id}
          onChange={() => setNowAddress(record.id)}
        />
      ),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <div>
          <h6>
            {record.tenNguoiNhan} | {record.soDienThoai}
          </h6>
          <p>
            {record.diaChi}, {record.tenXa}, {record.tenHuyen},{" "}
            {record.tenThanhPho}
          </p>
          {record.trangThai === 0 && <Tag color="red">Mặc định</Tag>}
        </div>
      ),
    },
    {
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            className="custom-button"
            onClick={() => handleOpenUpdateDiaChi(record)}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Địa chỉ"
      centered
      open={openModalDiaChi}
      onOk={handleUpdateTT}
      onCancel={handleClose}
      width={600}
    >
      <Button
        style={{ marginLeft: 400 }}
        type="primary"
        onClick={handleOpenADDModalDiaChi}
      >
        + Thêm địa chỉ mới
      </Button>

      <hr className="mt-4" />

      <Table
        pagination={{ position: ["none", "bottomRight"] }}
        columns={columns}
        dataSource={dataSource}
        locale={{ emptyText: "Không có dữ liệu" }}
        rowKey="key"
      />

      {/* Modal thêm địa chỉ */}
      <AddModalDiaChi
        openModalAddDiaChi={openModalAddDiaChi}
        setOpenModalAddDiaChi={setOpenModalAddDiaChi}
        idKH={idKH}
        loadDiaChi={loadDiaChi}
      />

      {/* Modal update địa chỉ */}
      <ModalUpdateDiaChi
        openModalUpdateDiaChi={openModalUpdateDiaChi}
        setOpenModalUpdateDiaChi={setOpenModalUpdateDiaChi}
        diaChiUpdate={diaChiUpdate}
        loadDiaChi={loadDiaChi}
      />
    </Modal>
  );
};

export default ModalDiaChi;
