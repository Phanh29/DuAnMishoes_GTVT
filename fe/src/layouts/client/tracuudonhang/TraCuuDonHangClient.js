import LogoGHN from "../../../assets/images/logoDiShip.jpg";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
} from "antd";
// import { HoaDonClientAPI } from "../../../pages/censor/api/HoaDonClient/HoaDonClientAPI";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const TraCuuDonHangClient = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [listBill, setlistBill] = useState([]);
  const handleSubmit = (values) => {
    // HoaDonClientAPI.SearchHDClient(values)
    //   .then((res) => {
    //     setlistBill(res.data);
    //     if (res.data.id != null) {

    //       form.resetFields();
    //       toast("🦄 Tra cứu đơn hàng thành công!", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //       });
    //       nav(`/hd/${res.data.id}`);
    //     }

    //     toast("🦄 Tra cứu đơn hàng thất bại !", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });

    //   })
    //   .catch(() => {
    //     toast("🦄 Tra cứu đơn hàng thành công!", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   });
  };

  return (
    <>
       <Breadcrumb style={{ marginBottom: 10 , borderBottom: "1px solid #E2E1E4",paddingBottom: 5}}>
        <Breadcrumb.Item>
          <Link to="/home" className="no-underline text-dark">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/tra-cuu-don-hang" className="no-underline text-dark"><b>Tra cứu đơn hàng</b></Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="row d-flex justify-content-center">
        <Form
          form={form}
          layout="vertical "
          style={{ paddingLeft: 400 }}
          onFinish={handleSubmit}
          className="mt-5"
        >
          <Row>
            <Col span={7} style={{ marginRight: "20px" }}>
              <Form.Item
                name="ma"
                label="Mã hóa đơn"
                tooltip="Vui lòng nhập mã hóa đơn"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="sdt"
                label="Số điện thoại"
                tooltip="Vui lòng nhập sdt"
              >
                <Input
                />
              </Form.Item>
            </Col>

            <Col className="d-flex align-items-center ms-2 mt-2">
              <Button
                style={{
                  // width: "110px",
                  // height: "40px",
                  // margin: "0 10px 10px 10px ",
                  backgroundColor: "#3366CC",
                  color: "white",
                }}
                // htmlType="reset"
                onClick={form.submit}
              >
                Hoàn tất
              </Button>
            </Col>
          </Row>
        </Form>
      <div className="text-center mb-5">
        <img src={LogoGHN} style={{ width: 700, height: 403 }}></img>
      </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
export default TraCuuDonHangClient;
