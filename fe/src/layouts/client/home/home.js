import React, { useState, useEffect } from "react";
import {  Carousel, Tabs } from "antd";
import { FaShippingFast } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineSupport } from "react-icons/md";
import { ProductCard } from "./productCard";
import { HomeAPI } from "../../../pages/api/client/HomeAPI";
import { SlideBanner } from "../sidebanner/SlideBanner ";

const { TabPane } = Tabs;

export const Home = ({ children }) => {
  const [newProducts, setNewProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const getNew = () => {
    HomeAPI.getAll("new").then((res) => setNewProducts(res.data));
  };
  const getFull = () => {
    HomeAPI.getAllSanPham().then((res) => setListProducts(res.data));
  };

  const getHot = () => {
    HomeAPI.getAll("hot").then((res) => setHotProducts(res.data));
  };

  useEffect(() => {
  
    getHot();
    getNew();
    getFull();
   
  }, []);

  return (
    <div className="container">
      {/* Carousel */}
      <Carousel autoplay style={{ width: "1296px", margin: "0 auto" }}>
        <SlideBanner
          img="https://d-themes.com/react/molla/demo-10/images/home/sliders/slide-1.jpg"
          subtitle="Ưu đãi và Khuyến mãi"
          title="Chỉ có tại MiShoes"
          price="giảm tới 500.000 VNĐ"
          btnText="Mua Ngay"
        />
        <SlideBanner
          img="https://d-themes.com/react/molla/demo-10/images/home/sliders/slide-3.jpg"
          subtitle="Ưu đãi và khuyến mãi"
          title="Can’t-miss Clearance:"
          price="starting at 60% off"
          btnText="Mua Ngay"
        />
        <SlideBanner
          img="http://res.cloudinary.com/dm0w2qws8/image/upload/v1706200379/rry3semtlkngaf9ktaqw.jpg"
          subtitle="Trending Now"
          title="This Week's Most Wanted"
          price="from $49.99"
          btnText="Mua Ngay"
        />
      </Carousel>

      {/* Banner nhỏ */}
      <div className="ms-1 mt-2">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {/* Banner nhỏ trái */}
              <div className="col-sm-6 p-2">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 250,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://d-themes.com/react/molla/demo-10/images/home/banners/banner-1.jpg"
                    alt="banner-small-1"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 220, // ~ ms-5
                      bottom: 20,
                      color: "#fff",
                    }}
                  >
                    <h4 style={{ margin: 0, fontWeight: 600 }}>
                      Trải Nghiệm Mới
                    </h4>
                    <h3 style={{ margin: "6px 0 0 0", fontWeight: 800 }}>
                      Các Mẫu <br /> Sneaker
                    </h3>
                    <a
                      href="/san-pham"
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        padding: "8px 16px",
                        borderRadius: 24,
                        border: "1px solid #fff",
                        color: "#fff",
                        textDecoration: "none",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      Khám Phá Ngay
                    </a>
                  </div>
                </div>
              </div>

              {/* Banner nhỏ phải */}
              <div className="col-sm-6 p-2">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 250,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706366863/dzdho3purfpnaryldhqz.jpg"
                    alt="banner-small-2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 80,
                      textAlign: "right",
                      color: "#111",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <h4 style={{ margin: 0, fontWeight: 600 }}>Hè Siêu Sale</h4>
                    <h3 style={{ margin: "2px 30px 0 0", fontWeight: 800 }}>
                      Nike
                    </h3>
                    <div style={{ marginTop: 4 }}>giảm tới 30%</div>
                    <a
                      href="/san-pham"
                      style={{
                        display: "inline-block",
                        marginTop: 10,
                        padding: "8px 16px",
                        borderRadius: 24,
                        border: "1px solid #111",
                        color: "#111",
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.8)",
                      }}
                    >
                      Mua Ngay
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner ngang dưới */}
            <div className="p-2">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 255,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706367750/py3zfnmo5nlc2tl7hkrw.jpg"
                  alt="banner-small-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "20%",
                    bottom: 20,
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    color: "#111",
                    padding: "10px 16px",
                    borderRadius: 12,
                  }}
                >
                  <h4 style={{ margin: 0, fontWeight: 600 }}>Sale Sốc</h4>
                  <h3 style={{ margin: "6px 0 0 0", fontWeight: 800 }}>
                    Các Mẫu Sneaker
                  </h3>
                  <div style={{ marginTop: 4 }}>giảm tới 30%</div>
                  <a
                    href="/san-pham"
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      padding: "8px 16px",
                      borderRadius: 24,
                      border: "1px solid #111",
                      color: "#111",
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Mua Ngay
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải lớn */}
          <div className="col-lg-4 p-2">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 520,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706369319/z5112262374541_8cb528ffa3d8249cb5bc7f9016e6d84a_geadua.jpg"
                alt="banner-right"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 120,
                  bottom: 10,
                  color: "#fff",
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  width: "100%",
                  padding: "24px 20px 12px 20px",
                }}
              >
                <h3 style={{ margin: 0, fontWeight: 800 }}>BST Mới</h3>
                <p style={{ margin: "6px 0 0 0" }}>Khám phá phối màu hot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box dịch vụ */}
      <div className="container mb-2 mt-5">
        <div className="row">
          {/* Item 1 */}
          <div className="col-sm-6 col-lg-3 border-box">
            <div
              className="icon-box"
              style={{ display: "flex", alignItems: "center", gap: "12px" }} // 🔹 fix căn hàng
            >
              <span className="icon-box-icon text-primary">
                <FaShippingFast size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title m-0">Miễn Phí Vận Chuyển</h3>
                <p className="m-0">Cho đơn từ 2 triệu</p>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="col-sm-6 col-lg-3 border-box">
            <div
              className="icon-box"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span className="icon-box-icon text-primary">
                <TfiReload size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title m-0">Trả Hàng Tại Cửa Hàng</h3>
                <p className="m-0">Trong vòng 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="col-sm-6 col-lg-3 border-box">
            <div
              className="icon-box"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span className="icon-box-icon text-primary">
                <IoIosInformationCircleOutline size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title m-0">Nhận Nhiều Ưu Đãi</h3>
                <p className="m-0">Khi đăng ký tài khoản</p>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="col-sm-6 col-lg-3 border-box">
            <div
              className="icon-box"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span className="icon-box-icon text-primary">
                <MdOutlineSupport size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title m-0">Hỗ Trợ</h3>
                <p className="m-0">Dịch vụ tuyệt vời 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="container mt-5">
        <h3 className="text-center">Sản phẩm</h3>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Sản phẩm " key="1">
            <div className="row">
              {listProducts.map((product, index) => (
                <div className="col-md-3" key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Sản phẩm bán chạy" key="2">
            <div className="row">
              {hotProducts.map((product, index) => (
                <div className="col-md-3" key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Sản phẩm mới" key="3">
            <div className="row">
              {newProducts.map((product, index) => (
                <div className="col-md-3" key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
