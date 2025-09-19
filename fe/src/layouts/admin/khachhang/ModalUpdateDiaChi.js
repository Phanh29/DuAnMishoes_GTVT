import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddressApi } from "../../../pages/api/address/AddressApi";
import { NguoiDungAPI } from "../../../pages/api/nguoidung/NguoiDungAPI";

const ModalUpdateDiaChi = (props) => {
  const [form] = Form.useForm();
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);

  const {
    openModalUpdateDiaChi,
    setOpenModalUpdateDiaChi,
    diaChiUpdate,
    loadDiaChi,
  } = props;

  const handleClose = () => setOpenModalUpdateDiaChi(false);

  const handleUpdateDC = (value) => {
    NguoiDungAPI.updateDiaChiByID(value.id, value)
      .then(() => {
        toast.success("✔️ Cập nhật địa chỉ thành công!");
        form.resetFields();
        loadDiaChi();
        handleClose();
      })
      .catch(() => {
        toast.error("Cập nhật địa chỉ thất bại!");
      });
  };

  const loadDataProvince = () => {
    AddressApi.fetchAllProvince()
      .then((res) => setListProvince(res.data.data || []))
      .catch(() => toast.error("Lỗi tải tỉnh/thành phố!"));
  };

  const loadDistrictsByProvinceId = (provinceId) => {
    if (!provinceId) return setListDistricts([]);
    AddressApi.fetchAllProvinceDistricts(provinceId)
      .then((res) => setListDistricts(res.data.data || []))
      .catch(() => toast.error("Lỗi tải quận/huyện!"));
  };

  const loadWardsByDistrictId = (districtId) => {
    if (!districtId) return setListWard([]);
    AddressApi.fetchAllProvinceWard(districtId)
      .then((res) => setListWard(res.data.data || []))
      .catch(() => toast.error("Lỗi tải xã/phường!"));
  };

  // ===== ONCHANGE =====
  const handleProvinceChange = (provinceId, option) => {
    form.setFieldsValue({
      idThanhPho: provinceId,
      tenThanhPho: option.label,
      idHuyen: undefined,
      tenHuyen: undefined,
      idXa: undefined,
      tenXa: undefined,
    });
    setListDistricts([]);
    setListWard([]);
    loadDistrictsByProvinceId(provinceId);
  };

  const handleDistrictChange = (districtId, option) => {
    form.setFieldsValue({
      idHuyen: districtId,
      tenHuyen: option.label,
      idXa: undefined,
      tenXa: undefined,
    });
    setListWard([]);
    loadWardsByDistrictId(districtId);
  };

  const handleWardChange = (wardCode, option) => {
    form.setFieldsValue({
      idXa: wardCode,
      tenXa: option.label,
    });
  };

  // ===== INIT =====
  useEffect(() => {
    if (diaChiUpdate) {
      form.setFieldsValue({
        id: diaChiUpdate.id,
        idNguoiDung: diaChiUpdate.nguoiDung,
        diaChi: diaChiUpdate.diaChi,
        tenNguoiNhan: diaChiUpdate.tenNguoiNhan,
        soDienThoai: diaChiUpdate.soDienThoai,
        trangThai: diaChiUpdate.trangThai,

        idThanhPho: String(diaChiUpdate.idThanhPho),
        tenThanhPho: diaChiUpdate.tenThanhPho,

        idHuyen: String(diaChiUpdate.idHuyen),
        tenHuyen: diaChiUpdate.tenHuyen,

        idXa: String(diaChiUpdate.idXa),
        tenXa: diaChiUpdate.tenXa,
      });

      loadDataProvince();
      if (diaChiUpdate.idThanhPho)
        loadDistrictsByProvinceId(diaChiUpdate.idThanhPho);
      if (diaChiUpdate.idHuyen) loadWardsByDistrictId(diaChiUpdate.idHuyen);
    }
  }, [diaChiUpdate, form]); // ✅ thêm form vào deps

  // options chuẩn: value = ID (string), label = Name
  const provinceOptions = listProvince.map((p) => ({
    value: String(p.ProvinceID),
    label: p.ProvinceName,
  }));
  const districtOptions = listDistricts.map((d) => ({
    value: String(d.DistrictID),
    label: d.DistrictName,
  }));
  const wardOptions = listWard.map((w) => ({
    value: String(w.WardCode),
    label: w.WardName,
  }));

  return (
    <Modal
      title="Cập nhật địa chỉ"
      centered
      open={openModalUpdateDiaChi}
      onOk={() => form.submit()}
      onCancel={handleClose}
      width={600}
    >
      <Form form={form} onFinish={handleUpdateDC} layout="vertical">
        {/* hidden */}
        <Form.Item name="idNguoiDung" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="trangThai" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="tenThanhPho" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="tenHuyen" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="tenXa" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="id" hidden />

        <Form.Item
          name="tenNguoiNhan"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="soDienThoai"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="idThanhPho"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố." }]}
        >
          <Select
            options={provinceOptions}
            onChange={handleProvinceChange}
            placeholder="--Chọn Tỉnh/Thành phố--"
          />
        </Form.Item>

        <Form.Item
          name="idHuyen"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện." }]}
        >
          <Select
            options={districtOptions}
            onChange={handleDistrictChange}
            placeholder="--Chọn Quận/Huyện--"
            disabled={!form.getFieldValue("idThanhPho")}
          />
        </Form.Item>

        <Form.Item
          name="idXa"
          label="Xã/Phường"
          rules={[{ required: true, message: "Vui lòng chọn Xã/Phường." }]}
        >
          <Select
            options={wardOptions}
            onChange={handleWardChange}
            placeholder="--Chọn Xã/Phường--"
            disabled={!form.getFieldValue("idHuyen")}
          />
        </Form.Item>

        <Form.Item
          name="diaChi"
          label="Số nhà"
          rules={[{ required: true, message: "Vui lòng nhập số nhà." }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateDiaChi;
