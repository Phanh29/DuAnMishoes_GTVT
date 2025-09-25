import React, { useState, useEffect } from "react";
import { Breadcrumb, Carousel, Tabs } from "antd";
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
      console.log(listProducts);
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
              <div className="col-sm-6 banner-group p-2">
                <img
                  src="https://d-themes.com/react/molla/demo-10/images/home/banners/banner-1.jpg"
                  width={"420px"}
                  height={"250px"}
                  alt="banner-small-1"
                />
                <div className="banner-content ms-5 mt-3">
                  <h4 className="banner-subtitle">Trải Nghiệm Mới</h4>
                  <h3 className="banner-title text-white">
                    Các Mẫu <br /> Sneaker
                  </h3>
                  <a
                    className="btn btn-outline-white banner-link btn-round mt-3"
                    href="/san-pham"
                  >
                    Khám Phá Ngay
                  </a>
                </div>
              </div>
              <div className="col-sm-6 banner-group p-2">
                <img
                  src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706366863/dzdho3purfpnaryldhqz.jpg"
                  width={"420px"}
                  height={"250px"}
                  alt="banner-small-2"
                />
                <div className="banner-content-left mt-3">
                  <h4 className="banner-subtitle text-dark">Hè Siêu Sale</h4>
                  <h3 className="banner-title text-dark">Nike</h3>
                  <div className="banner-text">giảm tới 30%</div>
                  <a
                    className="btn btn-outline-dark btn-round banner-link mt-3"
                    href="/san-pham"
                  >
                    Mua Ngay
                  </a>
                </div>
              </div>
            </div>
            <div className="banner-group">
              <img
                src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706367750/py3zfnmo5nlc2tl7hkrw.jpg"
                width={"855px"}
                height={"255px"}
                alt="banner-small-3"
              />
              <div className="banner-content-middle mt-3">
                <h4 className="banner-subtitle text-dark">Sale Sốc</h4>
                <h3 className="banner-title text-dark">Các Mẫu Sneaker</h3>
                <div className="banner-text">giảm tới 30%</div>
                <a
                  className="btn btn-outline-dark btn-round banner-link mt-3"
                  href="/san-pham"
                >
                  Mua Ngay
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 banner-group p-2">
            <img
              src="https://res.cloudinary.com/dm0w2qws8/image/upload/v1706369319/z5112262374541_8cb528ffa3d8249cb5bc7f9016e6d84a_geadua.jpg"
              width={"410px"}
              height={"520px"}
              alt="banner-right"
            />
          </div>
        </div>
      </div>

      {/* Box dịch vụ */}
      <div className="container mb-2">
        <div className="row">
          <div className="col-sm-6 col-lg-3 border-box">
            <div className="icon-box icon-box-side">
              <span className="icon-box-icon text-primary">
                <FaShippingFast size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title">Miễn Phí Vận Chuyển</h3>
                <p>Cho đơn từ 2 triệu</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3 border-box">
            <div className="icon-box icon-box-side">
              <span className="icon-box-icon text-primary">
                <TfiReload size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title">Trả Hàng Tại Cửa Hàng</h3>
                <p>Trong vòng 7 ngày</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3 border-box">
            <div className="icon-box icon-box-side">
              <span className="icon-box-icon text-primary">
                <IoIosInformationCircleOutline size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title">Nhận Nhiều Ưu Đãi</h3>
                <p>Khi đăng ký tài khoản</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="icon-box icon-box-side">
              <span className="icon-box-icon text-primary">
                <MdOutlineSupport size={40} color="#445f84" />
              </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title">Hỗ Trợ</h3>
                <p>Dịch vụ tuyệt vời 24/7</p>
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
