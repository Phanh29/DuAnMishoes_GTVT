import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { AddressApi } from "../../../pages/api/address/AddressApi";
import { toast } from "react-toastify";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";

const AddModalDiaChi = (props) => {
  const [form] = Form.useForm();
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  const { openModalAddDiaChi, setOpenModalAddDiaChi, idKH, loadDiaChi } = props;

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  const handleClose = () => {
    setOpenModalAddDiaChi(false);
    form.resetFields();
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setListDistricts([]);
    setListWard([]);
  };

  const handleSubmit = (values) => {
    const data = {
      ...values,
      idThanhPho: province?.key ?? province?.ProvinceID,
      idHuyen: district?.key ?? district?.DistrictID,
      idXa: ward?.key ?? ward?.WardCode,
      idNguoiDung: idKH,
    };
    NguoiDungAPI.addDCKH(data)
      .then(() => {
        toast.success("✔️ Thêm địa chỉ thành công!");
        loadDiaChi();
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("❌ Thêm địa chỉ thất bại!");
      });
  };

  const loadDataProvince = () => {
    AddressApi.fetchAllProvince()
      .then((res) => {
        setListProvince(res.data.data);
      })
      .catch(() => {
        toast.error("Lỗi tải danh sách tỉnh/thành phố!");
      });
  };

  const handleProvinceChange = (value, option) => {
    form.setFieldsValue({ tenThanhPho: value });
    setProvince(option);
    setDistrict(null);
    setWard(null);
    setListDistricts([]);
    setListWard([]);

    AddressApi.fetchAllProvinceDistricts(option.valueProvince)
      .then((res) => {
        setListDistricts(res.data.data);
      })
      .catch(() => {
        toast.error("Lỗi tải danh sách quận/huyện!");
      });
  };

  const handleDistrictChange = (value, option) => {
    form.setFieldsValue({ tenHuyen: value });
    setDistrict(option);
    setWard(null);
    setListWard([]);

    AddressApi.fetchAllProvinceWard(option.valueDistrict)
      .then((res) => {
        setListWard(res.data.data);
      })
      .catch(() => {
        toast.error("Lỗi tải danh sách xã/phường!");
      });
  };

  const handleWardChange = (value, option) => {
    form.setFieldsValue({ tenXa: value });
    setWard(option);
  };

  // ✅ Thêm form vào dependency array để fix warning
  useEffect(() => {
    if (idKH) {
      form.setFieldsValue({ idNguoiDung: idKH });
      loadDataProvince();
    }
  }, [idKH, form]);

  return (
    <Form form={form} layout="vertical">
      <Modal
        title="Thêm địa chỉ"
        centered
        open={openModalAddDiaChi}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch(() => {});
        }}
        onCancel={handleClose}
        width={600}
      >
        <Form.Item name="idNguoiDung" hidden>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="tenNguoiNhan"
          label="Họ và tên"
          tooltip="Họ tên đầy đủ của bạn là gì?"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên." },
            {
              pattern: /^[A-Za-zÀ-ỹ\s]+$/,
              message: "Họ tên chỉ chứa chữ cái.",
            },
          ]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="soDienThoai"
          label="Số điện thoại"
          tooltip="Số điện thoại của bạn là gì?"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại." },
            { pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ." },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="tenThanhPho"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố." }]}
        >
          <Select
            placeholder="--Chọn Tỉnh/Thành phố--"
            onChange={handleProvinceChange}
            allowClear
          >
            {listProvince.map((item) => (
              <Select.Option
                key={item.ProvinceID}
                value={item.ProvinceName}
                valueProvince={item.ProvinceID}
              >
                {item.ProvinceName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tenHuyen"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện." }]}
        >
          <Select
            placeholder="--Chọn Quận/Huyện--"
            onChange={handleDistrictChange}
            disabled={!province}
            allowClear
          >
            {listDistricts.map((item) => (
              <Select.Option
                key={item.DistrictID}
                value={item.DistrictName}
                valueDistrict={item.DistrictID}
              >
                {item.DistrictName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tenXa"
          label="Xã/Phường"
          rules={[{ required: true, message: "Vui lòng chọn Xã/Phường." }]}
        >
          <Select
            placeholder="--Chọn Xã/Phường--"
            onChange={handleWardChange}
            disabled={!district}
            allowClear
          >
            {listWard.map((item) => (
              <Select.Option
                key={item.WardCode}
                value={item.WardName}
                valueWard={item.WardCode}
              >
                {item.WardName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="diaChi"
          label="Số nhà"
          rules={[{ required: true, message: "Vui lòng nhập số nhà." }]}
        >
          <Input placeholder="Nhập số nhà, tên đường..." />
        </Form.Item>
      </Modal>
    </Form>
  );
};

export default AddModalDiaChi;
