import React, { useState, useEffect } from "react";
import {
  Button,
  Slider,
  Checkbox,
  Col,
  Collapse,
  Dropdown,
  Row,
  Space,
  Breadcrumb,
  Pagination,
} from "antd";
import { ProductCard } from "../../client/home/productCard";
import ModalDetailSP from "./ModalDetailSP";
import { HomeAPI } from "../../../pages/api/client/HomeAPI";
import { SortDescendingOutlined } from "@ant-design/icons";
import logoBanner from "../../../assets/images/page-header-bg.jpg";
import { Link } from "react-router-dom";


export const SanPhamClient = () => {
  const [products, setProducts] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]);
  const [hang, setHangs] = useState([]);
  const [mauSac, setMauSacs] = useState([]);
  const [kichThuoc, setKichThuocs] = useState([]);
  const [openModalDetailSP, setOpenModalDetailSP] = useState(false);
  const [sortType, setSortType] = useState("");

  // INIT
  useEffect(() => {
    const loadInit = async () => {
      const [sp, h, ms, kt] = await Promise.all([
        HomeAPI.getAllSanPham(),
        HomeAPI.getAllHang(),
        HomeAPI.getAllMauSac(),
        HomeAPI.getAllKichThuoc(),
      ]);
      const spData = sp.data || [];
      setProducts(spData);
      setBaseProducts(spData);
      setHangs(h.data || []);
      setMauSacs(ms.data || []);
      setKichThuocs(kt.data || []);
    };
    loadInit();
  }, []);

  // SORT
  const sortProducts = (type, srcList) => {
    const list = [...srcList];
    switch (type) {
      case "1":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "2":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "3":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "4":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }
    return list;
  };

  const handleSortChange = (type) => {
    setSortType(type);
    setProducts((prev) => sortProducts(type, prev));
    setCurrentPage(0);
  };

  const sortMenuItems = [
    {
      key: "1",
      label: (
        <button
          onClick={() => handleSortChange("1")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Giá tăng dần
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => handleSortChange("2")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Giá giảm dần
        </button>
      ),
    },
    {
      key: "3",
      label: (
        <button
          onClick={() => handleSortChange("3")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Từ A-Z
        </button>
      ),
    },
    {
      key: "4",
      label: (
        <button
          onClick={() => handleSortChange("4")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Từ Z-A
        </button>
      ),
    },
  ];


  // FILTER
  const [arrayHang, setArrayHang] = useState([]);
  const [arrayMauSac, setArrayMauSac] = useState([]);
  const [arrayKichThuoc, setArrayKichThuoc] = useState([]);
  const [giaBatDau, setGiaBatDau] = useState(0);
  const [giaKetThuc, setGiaKetThuc] = useState(40000000);

  const dataTimKiem = {
    arrayHang: arrayHang,
    arrayMauSac: arrayMauSac,
    arrayKichThuoc: arrayKichThuoc,
    giaBatDau: giaBatDau,
    giaKetThuc: giaKetThuc,
  };

  const changeHang = (idHang, checked) => {
    if (checked) {
      setArrayHang((prevArray) => [...prevArray, idHang]);
    } else {
      setArrayHang((prevArray) => prevArray.filter((item) => item !== idHang));
    }
  };

  const changeMauSac = (idMau, checked) => {
    if (checked) {
      setArrayMauSac((prevArray) => [...prevArray, idMau]);
    } else {
      setArrayMauSac((prevArray) => prevArray.filter((item) => item !== idMau));
    }
  };

  const changeKichThuoc = (idKichThuoc, checked) => {
    if (checked) {
      setArrayKichThuoc((prevArray) => [...prevArray, idKichThuoc]);
    } else {
      setArrayKichThuoc((prevArray) =>
        prevArray.filter((item) => item !== idKichThuoc)
      );
    }
  };

  const onChange = (value) => {
    setGiaBatDau(value[0]);
    setGiaKetThuc(value[1]);
  };

  const getTimMang = (data) => {
    HomeAPI.timMang(data).then((res) => {
      setProducts(res.data);
    });
  };


  useEffect(() => {
    const hasFilter =
      arrayHang.length > 0 ||
      arrayMauSac.length > 0 ||
      arrayKichThuoc.length > 0 ||
      giaBatDau !== 0 ||
      giaKetThuc !== 40_000_000;

    if (!hasFilter) {
      setProducts(
        sortType ? sortProducts(sortType, baseProducts) : baseProducts
      );
      setCurrentPage(0);
      return;
    }

    getTimMang(dataTimKiem);
  }, [
    arrayHang,
    arrayMauSac,
    arrayKichThuoc,
    giaBatDau,
    giaKetThuc,
    sortType,
    baseProducts,
  ]);

  // PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 12;
  const currentPageData = products.slice(
    currentPage * productsPerPage,
    currentPage * productsPerPage + productsPerPage
  );

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{
          marginBottom: 10,
          borderBottom: "1px solid #E2E1E4",
          paddingBottom: 5,
        }}
      >
        <Breadcrumb.Item>
          <Link to="/home" className="no-underline text-dark">
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/san-pham" className="no-underline text-dark">
            <b>Sản phẩm</b>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Banner */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "220px",
          overflow: "hidden",
        }}
      >
        <img
          src={logoBanner}
          alt="Logo Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <h1
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
            fontSize: "48px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Sản phẩm
        </h1>
      </div>

      <br />
      <br />

      <div className="row">
        {/* Filter */}
        <Space direction="vertical" className="col-md-2">
          <Collapse
            className="mb-2"
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Giá",
                children: (
                  <Slider
                    range
                    step={100_000} // mỗi nấc 100k
                    defaultValue={[100_000, 10_000_000]} // bắt đầu từ 100k tới 10tr
                    min={200_000} // min 100k
                    max={10_000_000} // max 10tr
                    onChange={onChange}
                    tooltip={{
                      formatter: (value) =>
                        `${value.toLocaleString("vi-VN")} VNĐ`,
                    }}
                  />
                ),
              },
            ]}
          />

          <Collapse
            className="mb-2"
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Hãng",
                children: (
                  <div style={{ maxHeight: 220, overflow: "auto" }}>
                    <Checkbox.Group>
                      {hang.map((h) => (
                        <Checkbox
                          key={h.id}
                          value={h.id}
                          onChange={(e) => changeHang(h.id, e.target.checked)}
                        >
                          <b>{h.ten}</b>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>
                ),
              },
            ]}
          />

          <Collapse
            className="mb-2"
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Màu sắc",
                children: (
                  <div style={{ maxHeight: 220, overflow: "auto" }}>
                    <Checkbox.Group>
                      {mauSac.map((m) => (
                        <Checkbox
                          key={m.id}
                          value={m.id}
                          onChange={(e) => changeMauSac(m.id, e.target.checked)}
                        >
                          <b>
                            {m.ten.charAt(0).toUpperCase() + m.ten.slice(1)}
                          </b>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>
                ),
              },
            ]}
          />

          <Collapse
            className="mb-2"
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Size",
                children: (
                  <Checkbox.Group>
                    {kichThuoc.map((kt) => (
                      <Col key={kt.id}>
                        <Checkbox
                          value={kt.id}
                          onChange={(e) =>
                            changeKichThuoc(kt.id, e.target.checked)
                          }
                        >
                          <b>{kt.ten}</b>
                        </Checkbox>
                      </Col>
                    ))}
                  </Checkbox.Group>
                ),
              },
            ]}
          />
        </Space>

        {/* Danh sách sản phẩm */}
        <div className="col-md-10">
          <Row gutter={16} className="mb-3">
            <div className="container">
              <div className="d-flex justify-content-end mb-4">
                <Dropdown
                  menu={{ items: sortMenuItems }}
                  placement="bottomLeft"
                  arrow
                >
                  <Button icon={<SortDescendingOutlined />}>Sắp xếp</Button>
                </Dropdown>
              </div>
              <div className="row me-2">
                {currentPageData.map((p, idx) => (
                  <div className="col-md-3" key={idx}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
            <div className="container mt-3">
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  current={currentPage + 1}
                  pageSize={productsPerPage}
                  total={products.length}
                  onChange={(page) => setCurrentPage(page - 1)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </Row>
        </div>
      </div>

      <ModalDetailSP
        openModalDetailSP={openModalDetailSP}
        setOpenModalDetailSP={setOpenModalDetailSP}
      />
    </div>
  );
};
