// src/pages/admin/dotgiamgia/tableChiTietSanPham.jsx
import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { DotGiamGiaAPI } from "../../../pages/api/dotgiamgia/DotGiamGiaAPI";

const POSSIBLE_PRODUCT_KEYS = [
  "idSP",
  "sanPhamId",
  "productId",
  "spId",
  "id_san_pham",
  "sanpham_id",
  "product_id",
];

// True nếu item thuộc spId dựa trên các khóa khả dĩ
const belongsToSP = (item, spId) => {
  const sid = String(spId);
  return POSSIBLE_PRODUCT_KEYS.some(
    (k) => item && item[k] != null && String(item[k]) === sid
  );
};

const TableChiTietSanPham = ({
  selectedIDSPs = [],
  onSelectedCTSanPham,
  suaIDCTSP,
}) => {
  const [ctsp, setCTSP] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load CTSP mỗi khi danh sách SP chọn thay đổi
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const ids = Array.from(new Set((selectedIDSPs || []).map(String)));
        if (ids.length === 0) {
          if (!cancelled) {
            setCTSP([]);
            setLoading(false);
          }
          return;
        }

        const responses = await Promise.all(
          ids.map((id) => DotGiamGiaAPI.loadCTSPBySP(id))
        );

        const merged = [];
        const seen = new Set();

        responses.forEach((res, idx) => {
          const currentSP = ids[idx];
          const raw = Array.isArray(res?.data) ? res.data : [];

          // 1) Thử lọc theo khóa product-id
          const filtered = raw.filter((item) => belongsToSP(item, currentSP));

          // 2) Nếu lọc xong rỗng nhưng raw có dữ liệu → fallback: dùng raw (giả định API đã lọc)
          const effective =
            filtered.length === 0 && raw.length > 0 ? raw : filtered;

          effective.forEach((item) => {
            const id = String(item.idCTSP ?? item.id ?? "");
            if (!id) return;
            if (!seen.has(id)) {
              seen.add(id);
              merged.push({ ...item, idCTSP: id }); // chuẩn hóa idCTSP thành string
            }
          });
        });

        if (!cancelled) setCTSP(merged);
      } catch (e) {
        console.error("Error loadCTSPBySP:", e);
        if (!cancelled) setCTSP([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedIDSPs]);

  // Áp sẵn lựa chọn khi sửa
  useEffect(() => {
    if (Array.isArray(suaIDCTSP) && suaIDCTSP.length > 0) {
      const uniq = Array.from(new Set(suaIDCTSP.map(String)));
      setSelectedRowKeys(uniq);
      onSelectedCTSanPham?.(uniq);
    }
  }, [suaIDCTSP, onSelectedCTSanPham]);

  const columnsChiTietSanPham = [
    {
      title: "#",
      dataIndex: "idCTSP",
      key: "idx",
      render: (_id, _r, i) => i + 1,
      showSorterTooltip: false,
    },
    { title: "Tên sản phẩm", dataIndex: "tenSP", key: "tenSP" },
    {
      title: "Kích thước",
      dataIndex: "tenKT",
      key: "tenKT",
      sorter: (a, b) =>
        (parseInt(a.tenKT, 10) || 0) - (parseInt(b.tenKT, 10) || 0),
    },
    {
      title: "Màu",
      dataIndex: "tenMS",
      key: "tenMS",
      render: (tenMS) => (
        <Tag
          color={tenMS}
          className="rounded-circle"
          style={{
            height: 25,
            width: 25,
            border: "1px solid black",
            borderColor: "black",
          }}
        />
      ),
    },
    { title: "Chất liệu", dataIndex: "tenCL", key: "tenCL" },
    { title: "Đế giày", dataIndex: "tenDG", key: "tenDG" },
    { title: "Hãng", dataIndex: "tenH", key: "tenH" },
    { title: "Danh mục", dataIndex: "tenDM", key: "tenDM" },
    { title: "Số lượng", dataIndex: "soLuong", key: "soLuong" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (t) =>
        t === "0" || t === 0 ? (
          <Tag color="#87d068">Đang bán</Tag>
        ) : (
          <Tag color="#f50">Hết hàng</Tag>
        ),
      filters: [
        { text: "Đang bán", value: "0" },
        { text: "Hết hàng", value: "1" },
      ],
      onFilter: (value, record) => String(record.trangThai) === String(value),
    },
  ];

  return (
    <Table
      rowKey="idCTSP"
      loading={loading}
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys);
          onSelectedCTSanPham?.(keys);
        },
      }}
      columns={columnsChiTietSanPham}
      dataSource={ctsp}
      pagination={{
        showQuickJumper: true,
        defaultCurrent: 1,
        defaultPageSize: 5,
        total: ctsp.length,
      }}
    />
  );
};

export default TableChiTietSanPham;
