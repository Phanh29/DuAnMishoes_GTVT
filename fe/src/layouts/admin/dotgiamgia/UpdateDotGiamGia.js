import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  DatePicker,
  Divider,
  Modal,
  Breadcrumb,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { BiSolidDiscount } from "react-icons/bi";
import { LuBadgePercent } from "react-icons/lu";
import { toast } from "react-toastify";
import TableSanPham from "./tableSanPham";
import TableChiTietSanPham from "./tableChiTietSanPham";
import dayjs from "dayjs";
import { DotGiamGiaAPI } from "../../../pages/api/dotgiamgia/DotGiamGiaAPI";

const UpdateDotGiamGia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [CTSP, setCTSP] = useState([]);
  const [idSP, setIDSP] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [formSuaKhuyenMai] = Form.useForm();
  const [dataCTSP, setDataCTSP] = useState([]);

  // giữ hàm loadKhuyenMai (trả về dữ liệu để fallback tìm record nếu cần)
  const loadKhuyenMai = async () => {
    try {
      const response = await DotGiamGiaAPI.getAll();
      const data = response.data || [];
      // nếu cần lưu local (như cũ) uncomment:
      // setKhuyenMais(data);
      return data;
    } catch (error) {
      console.error("Error loading khuyen mai list:", error);
      return [];
    }
  };

  // loadCTSP: giữ nguyên logic của bạn
  const loadCTSP = async () => {
    try {
      const x = await DotGiamGiaAPI.showProductByPromotion(id);
      setCTSP(x.data);
      setDataCTSP(x.data || []);

      const SP = await Promise.all(
        (x.data || []).map((idCTSP) =>
          DotGiamGiaAPI.showSPByProduct(idCTSP).catch((e) => ({ data: [] }))
        )
      );

      SP.forEach((res) => {
        setIDSP((prevData) =>
          // nếu res.data là mảng id SP
          Array.isArray(res.data)
            ? Array.from(new Set([...prevData, ...res.data]))
            : prevData
        );
      });
    } catch (err) {
      console.error("Error loading CTSP:", err);
    }
  };

  // **LƯU Ý: ĐÃ BỎ HOÀN TOÀN loadDetailKhuyenMai (không gọi PromotionAPI.detail(id))**

  // useEffect: nếu location.state.record có sẵn thì dùng ngay,
  // nếu không có thì fallback: gọi getAll() và tìm record theo id (KHÔNG gọi detail)
  useEffect(() => {
    const init = async () => {
      if (location && location.state && location.state.record) {
        const rec = location.state.record;
        formSuaKhuyenMai.setFieldsValue({
          id: rec.id,
          ma: rec.ma,
          loai: rec.loai,
          ten: rec.ten,
          gia_tri_khuyen_mai: rec.gia_tri_khuyen_mai,
          trang_thai: rec.trang_thai,
          ngay_bat_dau: rec.ngay_bat_dau
            ? dayjs(rec.ngay_bat_dau, "YYYY-MM-DD HH:mm:ss")
            : null,
          ngay_ket_thuc: rec.ngay_ket_thuc
            ? dayjs(rec.ngay_ket_thuc, "YYYY-MM-DD HH:mm:ss")
            : null,
        });

        setDataUpdate(rec);

        // nếu dotgiamgia list đã gửi kèm ctsp/sp thì dùng luôn
        if (rec.ctspList) setCTSP(rec.ctspList);
        if (rec.spList) setIDSP(rec.spList);
        // nếu thiếu CTSP thì loadCTSP (vẫn cần dữ liệu CTSP)
        if (!rec.ctspList) {
          await loadCTSP();
        }
      } else {
        // fallback: tìm record từ getAll() (không gọi detail)
        const all = await loadKhuyenMai();
        const found = all.find((r) => String(r.id) === String(id));
        if (found) {
          formSuaKhuyenMai.setFieldsValue({
            id: found.id,
            ma: found.ma,
            loai: found.loai,
            ten: found.ten,
            gia_tri_khuyen_mai: found.gia_tri_khuyen_mai,
            trang_thai: found.trang_thai,
            ngay_bat_dau: found.ngay_bat_dau
              ? dayjs(found.ngay_bat_dau, "YYYY-MM-DD HH:mm:ss")
              : null,
            ngay_ket_thuc: found.ngay_ket_thuc
              ? dayjs(found.ngay_ket_thuc, "YYYY-MM-DD HH:mm:ss")
              : null,
          });
          setDataUpdate(found);
          // load CTSP (vì getAll() thường ko trả ctsp detail)
          await loadCTSP();
        } else {
          // không tìm thấy => chuyển về danh sách
          toast.error(
            "Không tìm thấy đợt giảm giá. Vui lòng quay lại trang danh sách."
          );
          navigate("/admin-khuyen-mai");
        }
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeLoai = (value) => {};

  const [selectedValue, setSelectedValue] = useState("Tiền mặt");
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const [idKM, setIDKM] = useState("");
  const [khuyenMai, setKhuyenMais] = useState([]); // giữ nếu bạn dùng sau này

  const handleSubmit = (value) => {
    DotGiamGiaAPI.update(id, value)
      .then((response) => {
        setIDKM(response.data);
        // xử lý CTSP liên quan (giữ nguyên logic cũ)
        if (new Date() > new Date(value.ngay_ket_thuc)) {
          dataCTSP.map((data) =>
            DotGiamGiaAPI.deletePromotion(data.idCTSP, id)
          );
        } else {
          if (selectedIDCTSP.length > 0 && selectedIDSP.length > 0) {
            dataCTSP.map((data) =>
              selectedIDCTSP.filter((item) => item === data.idCTSP).length > 0
                ? DotGiamGiaAPI.updateProductByPromotion(
                    data.idCTSP,
                    response.data
                  )
                : DotGiamGiaAPI.deletePromotion(data.idCTSP, id)
            );
          } else {
            dataCTSP.map((data) =>
              DotGiamGiaAPI.deletePromotion(data.idCTSP, id)
            );
          }
        }

        // phát event để màn danh sách tự reload
        window.dispatchEvent(
          new CustomEvent("khuyenmai:changed", {
            detail: { id: response.data },
          })
        );

        navigate("/admin-khuyen-mai");
        toast("✔️ Sửa thành công!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setSelectedIDSP("");
        formSuaKhuyenMai.resetFields();
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const [selectedIDSP, setSelectedIDSP] = useState([]);
  const handleSelectedSanPham = (selectedRowKeys) => {
    setSelectedIDSP(selectedRowKeys);
  };
  const [selectedIDCTSP, setSelectedIDCTSP] = useState([]);

  const handleSelectedCTSanPham = (selectedRowKeys) => {
    setSelectedIDCTSP(selectedRowKeys);
  };

  // Validate ngày
  const validateDateKT = (_, value) => {
    const { getFieldValue } = formSuaKhuyenMai;
    const startDate = getFieldValue("ngay_bat_dau");
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
    }
    return Promise.resolve();
  };

  const validateDateBD = (_, value) => {
    const { getFieldValue } = formSuaKhuyenMai;
    const endDate = getFieldValue("ngay_ket_thuc");
    if (endDate && value && value.isAfter(endDate)) {
      return Promise.reject("Ngày bắt đầu phải trước ngày kết thúc");
    }

    return Promise.resolve();
  };

  return (
    <div className="container">
      <div>
        <Breadcrumb
          style={{ marginTop: "10px" }}
          items={[
            {
              href: "/admin-ban-hang",
              title: <HomeOutlined />,
            },
            {
              href: "http://localhost:3000/admin-ban-hang",
              title: (
                <>
                  <BiSolidDiscount size={15} style={{ paddingBottom: 2 }} />
                  <span>Giảm giá</span>
                </>
              ),
            },
            {
              href: "http://localhost:3000/admin-khuyen-mai",
              title: (
                <>
                  <LuBadgePercent size={15} style={{ paddingBottom: 2 }} />
                  <span>Đợt giảm giá</span>{" "}
                </>
              ),
            },
            {
              title: `Sửa đợt giảm giá ${dataUpdate.ma || ""} - ${
                dataUpdate.ten || ""
              }`,
            },
          ]}
        />
        <div className="container-fluid">
          <Divider orientation="center" color="none">
            <h2 className="text-first pt-1 fw-bold">
              <LuBadgePercent /> Thông tin chi tiết đợt giảm giá
            </h2>
          </Divider>
          <br />
          <div className="row">
            <div
              className="bg-light col-md-4"
              style={{ borderRadius: 20, marginBottom: 10, height: 550 }}
            >
              <Divider orientation="left" color="none">
                <h4 className="text-first pt-1 fw-bold">
                  <LuBadgePercent /> Thông tin đợt giảm giá
                </h4>
              </Divider>
              <Form
                // className=" row col-md-12"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
                initialValues={{
                  size: componentSize,
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{
                  maxWidth: 1600,
                }}
                onFinish={handleSubmit}
                form={formSuaKhuyenMai}
              >
                <Form.Item
                  label="Mã Khuyến Mại"
                  style={{ marginLeft: 0, width: 500 }}
                  name="ma"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống mã!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Mã khuyến mại"
                    style={{ marginLeft: 20, width: 220 }}
                    // value={dataUpdate.ma}
                  />
                </Form.Item>
                <Form.Item
                  label="Tên Khuyến Mại"
                  style={{ marginLeft: 0, width: 500 }}
                  name="ten"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống tên!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Tên khuyến mại"
                    style={{ marginLeft: 20, width: 220 }}
                    // value={dataUpdate.ten}
                  />
                </Form.Item>
                <Form.Item
                  label="Loại"
                  name="loai"
                  style={{ marginLeft: 0, width: 500 }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức!",
                    },
                  ]}
                >
                  <Select
                    onChange={handleChange}
                    style={{ marginLeft: 20, width: 220 }}
                    // value={dataUpdate.loai}
                  >
                    <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                    <Select.Option value="Phần trăm">Phần trăm</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Giá trị giảm"
                  name="gia_tri_khuyen_mai"
                  style={{ marginLeft: 0, width: 500 }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá trị giảm tối đa!",
                    },
                  ]}
                >
                  {dataUpdate.loai === "Tiền mặt" ||
                  dataUpdate.loai === "Tiền Mặt" ? (
                    <InputNumber
                      // defaultValue={0}
                      // value={dataUpdate.khuyen_mai_toi_da}
                      formatter={(value) =>
                        `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
                      onChange={onChangeLoai}
                      style={{ marginLeft: 20, width: 220 }}
                    />
                  ) : (
                    <InputNumber
                      // defaultValue={0}
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                      onChange={onChangeLoai}
                      style={{ marginLeft: 20, width: 220 }}
                      // value={dataUpdate.khuyen_mai_toi_da}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="ngay_bat_dau"
                  style={{ marginLeft: 0, width: 500 }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày bắt đầu!",
                    },
                    { validator: validateDateBD },
                  ]}
                >
                  <DatePicker
                    showTime
                    style={{ marginLeft: 20, width: 220 }}
                    placeholder="Ngày bắt đầu"
                    format={"YYYY-MM-DD HH:mm:ss"}
                    // value={moment(
                    //   dataUpdate.ngay_bat_dau,
                    //   "YYYY-MM-DD HH:mm:ss"
                    // )}
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name="ngay_ket_thuc"
                  style={{ marginLeft: 0, width: 500 }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc!",
                    },
                    { validator: validateDateKT },
                  ]}
                >
                  <DatePicker
                    showTime
                    style={{ marginLeft: 20, width: 220 }}
                    placeholder="Ngày kết thúc"
                    format={"YYYY-MM-DD HH:mm:ss"}
                    // value={moment(
                    //   dataUpdate.ngay_ket_thuc,
                    //   "YYYY-MM-DD HH:mm:ss"
                    // )}
                  />
                </Form.Item>

                <div className="text-end" style={{ marginTop: 50 }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      className=" bg-warning rounded-pill"
                      onClick={() => {
                        Modal.confirm({
                          title: "Thông báo",
                          content: "Bạn có chắc chắn muốn sửa không?",
                          onOk: () => {
                            formSuaKhuyenMai.submit();
                          },
                          footer: (_, { OkBtn, CancelBtn }) => (
                            <>
                              <CancelBtn />
                              <OkBtn />
                            </>
                          ),
                        });
                      }}
                    >
                      Sửa
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="col" style={{ marginLeft: 20 }}>
              <div className="row bg-light" style={{ borderRadius: 20 }}>
                <div>
                  <p className="fw-bold" style={{ marginTop: 10 }}>
                    Sản phẩm
                  </p>
                </div>
                <TableSanPham
                  onSelectedSanPham={handleSelectedSanPham}
                  suaIDSP={idSP}
                />
              </div>
              <div
                className="row bg-light"
                style={{ borderRadius: 20, marginTop: 10, marginBottom: 10 }}
              >
                <div>
                  <p className="fw-bold" style={{ marginTop: 10 }}>
                    Chi Tiết Sản Phẩm
                  </p>
                </div>
                <TableChiTietSanPham
                  selectedIDSPs={selectedIDSP}
                  onSelectedCTSanPham={handleSelectedCTSanPham}
                  suaIDCTSP={CTSP}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateDotGiamGia;
