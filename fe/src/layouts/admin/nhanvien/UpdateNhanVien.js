import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import { AddressApi } from "../../../pages/api/address/AddressApi";
import { useNavigate, useParams } from "react-router-dom";
import UpLoadImageUpdate from "../../uploadAnh/UpLoadImage";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { FaMoneyBills } from "react-icons/fa6";

export default function UpdateNhanVien() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const nav = useNavigate();
  const [fileImage, setFileImage] = useState(null);
  const [oldImage, setOldImage] = useState(""); // link ảnh cũ
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const provinceRes = await AddressApi.fetchAllProvince();
        setListProvince(provinceRes.data.data);

        const empRes = await NguoiDungAPI.getOneByIdUser("nhan-vien",id);
        const data = empRes.data;

        if (data.idthanhPho) {
          const districtRes = await AddressApi.fetchAllProvinceDistricts(
            data.idthanhPho
          );
          setListDistricts(districtRes.data.data);
        }

        if (data.idhuyen) {
          const wardRes = await AddressApi.fetchAllProvinceWard(data.idhuyen);
          setListWard(wardRes.data.data);
        }

        // lưu link ảnh cũ
        setOldImage(data.anh || "");

        form.setFieldsValue({
          ten: data.ten || "",
          canCuocCongDan: data.cccd || "",
          gioiTinh: data.gioiTinh || "",
          email: data.email || "",
          soDienThoai: data.soDienThoai || "",
          provinceId: Number(data.idthanhPho) || "",
          districtId: Number(data.idhuyen) || "",
          wardCode: data.idxa || "",
          diaChi: data.diaChi || "",
          ngaySinh:
            data.ngaySinh && !isNaN(Number(data.ngaySinh))
              ? moment(Number(data.ngaySinh))
              : null,
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [id, form]);

  const handleProvinceChange = (value) => {
    form.setFieldsValue({ provinceId: value, districtId: "", wardCode: "" });
    setListDistricts([]);
    setListWard([]);
    if (value) {
      AddressApi.fetchAllProvinceDistricts(value).then((res) => {
        setListDistricts(res.data.data);
      });
    }
  };

  const handleDistrictChange = (value) => {
    form.setFieldsValue({ districtId: value, wardCode: "" });
    setListWard([]);
    if (value) {
      AddressApi.fetchAllProvinceWard(value).then((res) => {
        setListWard(res.data.data);
      });
    }
  };

  const handleWardChange = (value) => {
    form.setFieldsValue({ wardCode: value });
  };

  const handleFileUpload = (fileData) => {
    setFileImage(fileData); // file mới
  };

  const handleSuccess = () => {
    form.validateFields().then((values) => {
      const provinceName =
        listProvince.find(
          (p) => Number(p.ProvinceID) === Number(values.provinceId)
        )?.ProvinceName || "";

      const districtName =
        listDistricts.find(
          (d) => Number(d.DistrictID) === Number(values.districtId)
        )?.DistrictName || "";

      const wardName =
        listWard.find((w) => w.WardCode === values.wardCode)?.WardName || "";

      const payload = {
        ...values,
        ngaySinh:
          values.ngaySinh && moment(values.ngaySinh).isValid()
            ? values.ngaySinh.startOf("day").valueOf()
            : null,
        idThanhPho: Number(values.provinceId),
        idHuyen: Number(values.districtId),
        idXa: values.wardCode,
        tenThanhPho: provinceName,
        tenHuyen: districtName,
        tenXa: wardName,
        id: id,
        anh: fileImage ? fileImage : oldImage,
        // nếu không upload mới, giữ link cũ
      };

      const formData = new FormData();
      if (fileImage) formData.append("file", fileImage); // nếu có thì append file
      formData.append("request", JSON.stringify(payload));
      NguoiDungAPI.update("nhan-vien",formData)
        .then(() => {
          toast.success("Cập nhật thành công!", { autoClose: 3000 });
          nav("/admin-nhan-vien");
        })
        .catch(() => toast.error("Có lỗi xảy ra"));
    });
  };

  return (
    <div>
      <h3 className="text-first text-center fw-bold">
        <FaMoneyBills /> Update nhân viên
      </h3>
      {loading ? (
        <Spin spinning />
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={14} style={{ marginTop: 30 }}>
            <Col span={7}>
              <Card style={{ height: "100%", minHeight: "550px" }}>
                <h5 className="text-center fw-bold">Ảnh đại diện</h5>
                <Row justify="center" className="mt-5">
                  <UpLoadImageUpdate
                    onFileUpload={handleFileUpload}
                    defaultImage={oldImage} // set preview ảnh cũ
                  />
                </Row>
              </Card>
            </Col>
            <Col span={17}>
              <Card>
                <h5 className="text-center fw-bold">Thông tin nhân viên</h5>
                <Row justify="end" style={{ margin: "10px 0" }}>
                  <Button
                    onClick={handleSuccess}
                    style={{
                      width: 110,
                      height: 40,
                      backgroundColor: "#3366CC",
                      color: "white",
                      marginLeft: 180,
                    }}
                  >
                    Hoàn tất
                  </Button>
                </Row>
                <Row>
                  <Col span={11} style={{ marginRight: 20 }}>
                    <Form.Item
                      name="ten"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên." },
                      ]}
                    >
                      <Input className="text-center" />
                    </Form.Item>
                    <Form.Item
                      name="canCuocCongDan"
                      label="Căn cước"
                      rules={[
                        { required: true, message: "Vui lòng nhập CCCD." },
                        { pattern: /^\d{12}$/, message: "CCCD cần 12 số." },
                      ]}
                    >
                      <Input className="text-center" />
                    </Form.Item>
                    <Form.Item
                      name="gioiTinh"
                      label="Giới tính"
                      rules={[
                        { required: true, message: "Vui lòng chọn giới tính." },
                      ]}
                    >
                      <Select>
                        <Select.Option value="">Chọn giới tính</Select.Option>
                        <Select.Option value="true">Nam</Select.Option>
                        <Select.Option value="false">Nữ</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="provinceId"
                      label="Tỉnh/Thành phố"
                      rules={[
                        { required: true, message: "Vui lòng chọn tỉnh." },
                      ]}
                    >
                      <Select onChange={handleProvinceChange}>
                        <Select.Option value="">
                          --Chọn tỉnh/thành phố--
                        </Select.Option>
                        {listProvince.map((p) => (
                          <Select.Option
                            key={p.ProvinceID}
                            value={Number(p.ProvinceID)}
                          >
                            {p.ProvinceName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="wardCode"
                      label="Xã/Phường"
                      rules={[
                        { required: true, message: "Vui lòng chọn xã/phường." },
                      ]}
                    >
                      <Select onChange={handleWardChange}>
                        <Select.Option value="">
                          --Chọn xã/phường--
                        </Select.Option>
                        {listWard.map((w) => (
                          <Select.Option key={w.WardCode} value={w.WardCode}>
                            {w.WardName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      name="ngaySinh"
                      label="Ngày sinh"
                      rules={[
                        { required: true, message: "Vui lòng nhập ngày sinh." },
                      ]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        className="w-100 datepicker-center"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email." },
                        { type: "email", message: "Email không hợp lệ." },
                      ]}
                    >
                      <Input className="text-center" />
                    </Form.Item>
                    <Form.Item
                      name="soDienThoai"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại.",
                        },
                        {
                          pattern: /^0\d{9}$/,
                          message:
                            "Số điện thoại phải bắt đầu bằng 0 và có 10 số.",
                        },
                      ]}
                    >
                      <Input className="text-center" />
                    </Form.Item>
                    <Form.Item
                      name="districtId"
                      label="Quận/Huyện"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn quận/huyện.",
                        },
                      ]}
                    >
                      <Select onChange={handleDistrictChange}>
                        <Select.Option value="">
                          --Chọn quận/huyện--
                        </Select.Option>
                        {listDistricts.map((d) => (
                          <Select.Option
                            key={d.DistrictID}
                            value={Number(d.DistrictID)}
                          >
                            {d.DistrictName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="diaChi"
                      label="Số nhà"
                      rules={[
                        { required: true, message: "Vui lòng nhập số nhà." },
                      ]}
                    >
                      <Input className="text-center" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </Form>
      )}
    </div>
  );
}
