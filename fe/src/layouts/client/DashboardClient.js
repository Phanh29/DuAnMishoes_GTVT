import React, { useState, useEffect } from "react";
import {
  Layout,
  theme,
  Image,
  Badge,
  Avatar,
  Dropdown,
  Space,
  Col,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { TbShoppingCartHeart } from "react-icons/tb";
import { FaFacebook, FaInstagram, FaTwitch, FaTwitter } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import Search from "antd/es/input/Search";
import { get } from "local-storage";
import { useCart } from "./cart/CartContext";

import logoShop from "../../assets/images/logoNgang1.png";

const { Header, Content, Footer } = Layout;

const accountMenu = (nav, dangXuat) => [
  {
    key: "1",
    label: (
      <span onClick={() => nav("/tai-khoan-cua-toi")}>Thông tin tài khoản</span>
    ),
  },
  {
    key: "2",
    label: <span onClick={() => nav("/doi-mat-khau")}>Đổi mật khẩu</span>,
  },
  { key: "3", label: <span onClick={() => nav("/history")}>Đơn mua</span> },
  { key: "4", label: <span onClick={dangXuat}>Đăng xuất</span> },
];

export const DashboardClient = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState({ name: null, avatar: null });
  const { totalQuantity } = useCart();
  const [valueSearch, setValueSearch] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const storedUser =
      get("userData") || get("userGoogle") || get("userFacebook");
    if (storedUser) {
      setUser({
        name: storedUser.ten || storedUser.name,
        avatar: storedUser.anh || storedUser.imageUrl || null,
      });
    }
  }, []);

  const dangXuat = () => {
    localStorage.clear();
    nav("/login");
  };

  const onSearch = (value) => {
    if (!value.trim()) return;
    nav(`/home-tim-kiem/${value.trim()}`);
    setValueSearch("");
  };

  const displayName = user.name
    ? user.name.split(" ").slice(-2).join(" ")
    : "Đăng nhập";

  return (
    <Layout>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          position: "sticky",
          top: 0,
          zIndex: 30,
          width: "100%",
          backgroundColor: "#fff",
          color: "black",
        }}
      >
        <Col span={4}>
          <Image style={{ height: 60 }} width={170} src={logoShop} />
        </Col>

        {[
          { path: "/home", label: "Trang chủ" },
          { path: "/san-pham", label: "Sản phẩm" },
          { path: "/tra-cuu-don-hang", label: "Tra cứu đơn hàng" },
          { path: "/chinh-sach", label: "Chính sách" },
        ].map((item, idx) => (
          <Col
            span={2}
            key={idx}
            className="d-flex align-items-center justify-content-center"
          >
            <Link to={item.path} className="text-decoration-none">
              <h6 className="button-menu-trai d-flex align-items-center mt-1">
                {item.label}
              </h6>
            </Link>
          </Col>
        ))}

        {/* Search */}
        <Col
          span={3}
          className="d-flex align-items-center justify-content-center"
        >
          <Search
            placeholder="Tìm kiếm ..."
            onSearch={onSearch}
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
          />
        </Col>

        {/* Cart */}
        <Col span={1}>
          <Link to={"/gio-hang"} className="float-end">
            <Badge count={totalQuantity} offset={[8, 1]}>
              <TbShoppingCartHeart size={30} />
            </Badge>
          </Link>
        </Col>

        {/* Avatar + Dropdown */}
        <Col span={1} className="ms-1">
          {user.name ? (
            <Dropdown menu={{ items: accountMenu(nav, dangXuat) }}>
              <Typography.Link>
                <Space>
                  <Avatar
                    size="large"
                    src={user.avatar}
                    style={{ marginLeft: 40 }}
                  />
                </Space>
              </Typography.Link>
            </Dropdown>
          ) : (
            <Link to={"/login"}>
              <Avatar size="large" style={{ marginLeft: 40 }} />
            </Link>
          )}
        </Col>

        {/* Username */}
        <Col span={2} className="ms-5 fw-bold">
          {displayName}
        </Col>
      </Header>

      {/* Marquee */}
      <marquee
        style={{
          fontStyle: "italic",
          color: "Black",
          fontSize: 16,
          fontWeight: "Bolder",
        }}
        direction="left"
        scrollamount="5"
      >
        🔥🔥 Hè rực rỡ ưu đãi khủng cho hóa đơn từ 10.000.000 VND ! Mua ngay
        🔥🔥
      </marquee>

      {/* Content */}
      <Content style={{ padding: "0 48px", backgroundColor: "white" }}>
        <div className="mt-3 mb-3"></div>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          backgroundImage:
            "url('https://cdn.shopify.com/s/files/1/2495/5044/products/salvas-white-leather-sneaker.slideshow5_eb2d8421-fc8f-4759-97e9-3f8f679f44a4.png?v=1676536621')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="row">
          <div className="col-md-2">
            <Image className="mt-3" src={logoShop} width={150} />
            <div className="mt-4">
              <h5>GIỚI THIỆU</h5>
            </div>
            <div>
              <Link
                to={"/san-pham"}
                className="text-dark text-decoration-none me-2"
              >
                Sản phẩm
              </Link>
            </div>
            <div>
              <Link
                to={"/tra-cuu-don-hang"}
                className="text-dark text-decoration-none me-2"
              >
                Đơn hàng
              </Link>
            </div>
            <div>
              <Link
                to={"/chinh-sach"}
                className="text-dark text-decoration-none"
              >
                Chính sách trả hàng
              </Link>
              <br />
              <div className="mt-3">MiShoes - Created by SD-26</div>
            </div>
          </div>

          <div className="col-md-8"></div>

          <div className="col-md-2 mt-5">
            <h5>SNEAKER MISHOES</h5>
            <div>
              <p>Địa chỉ: Nam Từ Liêm – Hà Nội</p>
              <Link
                to={"tel:0988353709"}
                className="text-dark text-decoration-none"
              >
                Hotline: 0988 353 709
              </Link>
              <br />
              <Link
                to={"mailto:shopmishoes@gmail.com"}
                className="text-dark text-decoration-none"
              >
                Email: shopmishoes@gmail.com
              </Link>
            </div>
            <div className="mt-4">
              <FaFacebook size={30} className="me-2" />
              <FaTwitter size={30} className="me-2" />
              <FaInstagram size={30} className="me-2" />
              <BiLogoGmail size={30} className="me-2" />
              <FaTwitch size={30} className="me-2" />
            </div>
          </div>
        </div>
      </Footer>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={5000} />
    </Layout>
  );
};
