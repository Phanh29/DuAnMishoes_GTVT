import "react-pro-sidebar/dist/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./DashBoardAdmin.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  Avatar,
  Badge,
  Button,
  Layout,
  theme,
  Image,
  Dropdown,
  Typography,
  Space,
} from "antd";
import { FaGithub, FaTshirt, FaTag } from "react-icons/fa";
import { GoNumber } from "react-icons/go";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { GiMaterialsScience, GiReturnArrow } from "react-icons/gi";
import { IoColorPalette } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";
import {
  BiSolidCategory,
  BiSolidUserBadge,
  BiSolidUserDetail,
} from "react-icons/bi";
import { BsBoxSeamFill } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { FaCartShopping, FaMoneyBills } from "react-icons/fa6";
import { PiTrademarkFill } from "react-icons/pi";
import { LuBadgePercent } from "react-icons/lu";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { get } from "local-storage";
import logoShop from "../../assets/images/logo.png";
// import { AdThongBaoDatHang } from "../../utils/socket/socket";
// import Notification from "../user/notification";

const { Header, Sider, Content } = Layout;

const DashboardAdmin = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [linkAnh, setLinkAnh] = useState("");
  const nav = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // --- Helpers
  const goLogin = useCallback(() => nav("/login", { replace: true }), [nav]);
  const dangXuat = useCallback(() => {
    localStorage.clear();
    goLogin();
  }, [goLogin]);

  const DoiMatKhau = useCallback(() => {
    nav("/admin-doi-mat-khau");
  }, [nav]);

  // --- Effect: Auth + profile (+ socket nếu bật)
  useEffect(() => {
    const storedData = get("userData") || {};
    const token = storedData?.accessToken;

    if (!token) {
      goLogin();
      return;
    }

    setUserName(storedData?.ten || "Người dùng");
    setLinkAnh(storedData?.anh || "");

    // AdThongBaoDatHang && AdThongBaoDatHang();
  }, [goLogin]);

  // --- Dropdown items
  const dropdownItems = useMemo(
    () => [
      {
        key: "1",
        label: (
          <button className="menu-btn" onClick={DoiMatKhau}>
            Đổi mật khẩu
          </button>
        ),
      },
      { key: "2", label: <span>Thông tin</span> },
      {
        key: "3",
        label: (
          <button className="menu-btn" onClick={dangXuat}>
            Đăng xuất
          </button>
        ),
      },
    ],
    [DoiMatKhau, dangXuat]
  );

  // --- Cấu hình menu (data-driven)
  const menuConfig = useMemo(
    () => [
      {
        type: "item",
        icon: <RxDashboard size={20} color="#f7faf9" />,
        label: "Quản lý Thống Kê",
        to: "/admin-thong-ke",
      },
      {
        type: "item",
        icon: <FaCartShopping size={20} color="#f7faf9" />,
        label: "Bán Hàng Tại Quầy",
        to: "/admin-ban-hang",
      },
      {
        type: "submenu",
        icon: <BsBoxSeamFill size={20} color="#f7faf9" />,
        title: "Quản Lý Sản Phẩm",
        children: [
          {
            icon: <FaTshirt size={20} color="#f7faf9" />,
            label: "Sản Phẩm",
            to: "/admin-san-pham",
          },
          {
            icon: <BiSolidCategory size={20} color="#f7faf9" />,
            label: "Danh Mục",
            to: "/admin-danh-muc",
          },
          {
            icon: <AiOutlineColumnHeight size={20} color="#f7faf9" />,
            label: "Đế giày",
            to: "/admin-de-giay",
          },
          {
            icon: <GiMaterialsScience size={20} color="#f7faf9" />,
            label: "Chất Liệu",
            to: "/admin-chat-lieu",
          },
          {
            icon: <GoNumber size={20} color="#f7faf9" />,
            label: "Kích thước",
            to: "/admin-kich-thuoc",
          },
          {
            icon: <IoColorPalette size={20} color="#f7faf9" />,
            label: "Màu Sắc",
            to: "/admin-mau-sac",
          },
          {
            icon: <PiTrademarkFill size={20} color="#f7faf9" />,
            label: "Hãng",
            to: "/admin-hang",
          },
        ],
      },
      {
        type: "submenu",
        icon: <RiAccountCircleFill size={20} color="#f7faf9" />,
        title: "Quản Lý Tài Khoản",
        children: [
          {
            icon: <BiSolidUserBadge size={20} color="#f7faf9" />,
            label: "Nhân Viên",
            to: "/admin-nhan-vien",
          },
          {
            icon: <BiSolidUserDetail size={25} color="#f7faf9" />,
            label: "Khách Hàng",
            to: "/admin-khach-hang",
          },
        ],
      },
      {
        type: "item",
        icon: <FaMoneyBills size={20} color="#f7faf9" />,
        label: "Hóa Đơn",
        to: "/admin-hoa-don",
        suffix: <Badge className="icon-hoa-don" count="New" color="red" />,
      },
      {
        type: "submenu",
        icon: <BiSolidDiscount size={20} color="#f7faf9" />,
        title: "Giảm giá",
        children: [
          {
            icon: <LuBadgePercent size={25} color="#f7faf9" />,
            label: "Đợt giảm giá",
            to: "/admin-dot-giam-gia",
          },
          {
            icon: <FaTag size={20} color="#f7faf9" />,
            label: "Phiếu giảm giá",
            to: "/admin-voucher",
          },
        ],
      },
      {
        type: "item",
        icon: <GiReturnArrow size={20} color="#f7faf9" />,
        label: "Trả hàng",
        to: "/admin-tra-hang",
      },
    ],
    []
  );

  const renderMenu = (cfg) => {
    if (cfg.type === "item") {
      return (
        <MenuItem key={cfg.to} icon={cfg.icon} suffix={cfg.suffix}>
          {cfg.label}
          <NavLink to={cfg.to} />
        </MenuItem>
      );
    }
    if (cfg.type === "submenu") {
      return (
        <SubMenu key={cfg.title} title={cfg.title} icon={cfg.icon}>
          {cfg.children?.map((c) => (
            <MenuItem key={c.to} icon={c.icon}>
              {c.label}
              <NavLink to={c.to} />
            </MenuItem>
          ))}
        </SubMenu>
      );
    }
    return null;
  };

  return (
    <Layout className="layout-censor">
      {/* --- SIDEBAR --- */}
      <Sider trigger={null} collapsible collapsed={collapsed} width={235}>
        <ProSidebar
          className="nav-sidebar"
          collapsed={collapsed}
          width={235}
          breakPoint="md"
          image="https://i.pinimg.com/564x/1e/49/73/1e4973a1a63fe26c8201259c8d9c77cb.jpg"
        >
          <SidebarHeader>
            <div className="sidebar-header d-flex justify-content-center align-items-center">
              <div className="logo_slibar">
                {!collapsed ? (
                  <div className="logo-stack d-flex justify-content-center align-items-center">
                    <Image width={100} src={logoShop} preview={false} />
                  </div>
                ) : (
                  <Image width={40} src={logoShop} preview={false} />
                )}
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <Menu iconShape="circle">{menuConfig.map(renderMenu)}</Menu>
          </SidebarContent>

          <SidebarFooter style={{ textAlign: "center", marginTop: "auto" }}>
            <div className="sidebar-btn-wrapper">
              <a
                href="https://github.com/Phanh29/DuAnMishoes_GTVT"
                className={`sidebar-btn ${collapsed ? "" : "expanded"}`}
                rel="noopener noreferrer"
              >
                <FaGithub size={20} color="#f7faf9" />
                {!collapsed && <span className="footer-brand">Mi Shoes</span>}
              </a>
            </div>
          </SidebarFooter>
        </ProSidebar>
      </Sider>

      {/* --- MAIN --- */}
      <Layout>
        {/* HEADER */}
        <Header
          className="header-layout"
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((v) => !v)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />

          <div className="admin-right float-end hover">
            {/* <Notification /> */}
            <Dropdown
              menu={{ items: dropdownItems, selectable: false }}
              className="ms-4"
              placement="bottomRight"
            >
              <Typography.Link>
                <Space>
                  <Avatar
                    shape="circle"
                    size="large"
                    src={linkAnh}
                    style={{ marginLeft: 40 }}
                    icon={<IoNotifications />}
                  />
                </Space>
              </Typography.Link>
            </Dropdown>

            <div className="bold ms-2">
              <strong>{userName}</strong>
            </div>
          </div>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            padding: 24,
            paddingRight: 7,
            minHeight: 280,
            borderRadius: 15,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
