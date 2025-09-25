// src/pages/admin/dotgiamgia/tableSanPham.jsx
import React, { useState, useEffect } from "react";
import { Table, Tag, Form, Input } from "antd";
import { DotGiamGiaAPI } from "../../../pages/api/dotgiamgia/DotGiamGiaAPI";

const TableSanPham = ({ onSelectedSanPham, suaIDSP }) => {
  const [sanPham, setSanPhams] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const loadSanPham = async () => {
      try {
        const res = await DotGiamGiaAPI.loadSP();
        const data = (res.data || []).map((it) => ({
          ...it,
          idSP: String(it.idSP),
        }));
        setSanPhams(data);
      } catch (error) {
        console.error("Error loadSP:", error);
      }
    };
    loadSanPham();
  }, []);

  useEffect(() => {
    if (Array.isArray(suaIDSP) && suaIDSP.length > 0) {
      const uniq = Array.from(new Set(suaIDSP.map(String)));
      setSelectedRowKeys(uniq);
      onSelectedSanPham?.(uniq);
    }
  }, [suaIDSP, onSelectedSanPham]);

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys);
    onSelectedSanPham?.(keys);
  };

  const columnsSanPham = [
    {
      title: "#",
      dataIndex: "idSP",
      key: "idx",
      render: (_id, _r, i) => i + 1,
      showSorterTooltip: false,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
      sorter: (a, b) => {
        const na = parseInt(String(a.ma).replace(/\D/g, "") || "0", 10);
        const nb = parseInt(String(b.ma).replace(/\D/g, "") || "0", 10);
        return na - nb;
      },
    },
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Số lượng", dataIndex: "soLuong", key: "soLuong" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (t) =>
        t === 0 || t === "0" ? (
          <Tag color="#87d068">Đang bán</Tag>
        ) : (
          <Tag color="#f50">Hết hàng</Tag>
        ),
    },
  ];

  return (
    <div className="container">
      <Form>
        <Form.Item label="Tìm kiếm" name="key">
          <Input
            placeholder="Tìm kiếm"
            className="rounded-pill border-warning"
          />
        </Form.Item>
      </Form>

      <Table
        rowKey="idSP"
        rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }}
        columns={columnsSanPham}
        dataSource={sanPham}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          defaultPageSize: 5,
          total: sanPham.length,
        }}
      />
    </div>
  );
};

export default TableSanPham;
