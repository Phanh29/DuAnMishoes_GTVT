// src/components/thuoc-tinh/kich-thuoc/UpdateKichThuoc.js
import React from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateKichThuoc({
  openUpdate,
  setOpenUpdate,
  form1,
  ktUpdate,
  setKtUpdate,
  tenCheck,             
  kichThuoc,           
  loadKichThuoc,       
  norm,               
  componentSize,
  onFormLayoutChange,
  formItemLayout,
}) {

  const validateDateKichThuocUpdate = (_, value) => {
    const tenTim = form1.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim())
      return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(tenTim))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 34 || n > 47)
      return Promise.reject("Kích thước phải là số nguyên từ 34 đến 47");
    return Promise.resolve();
  };


  const updateKichThuoc = () => {
    if (ktUpdate.ten !== tenCheck) {
      const exists = kichThuoc.some((x) => norm(x.ten) === norm(ktUpdate.ten));
      if (exists) {
        toast.error("Kích thước trùng với kích thước khác!");
        return;
      }
    }
    ThuocTinhAPI.update("kich-thuoc", ktUpdate.id, ktUpdate)
      .then(() => {
        toast.success("Sửa thành công!");
        setKtUpdate("");
        form1.resetFields();
        loadKichThuoc();
        setOpenUpdate(false);
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật!");
      });
  };

  return (
    <Modal
      title="Sửa kích thước"
      centered
      open={openUpdate}
      onCancel={() => setOpenUpdate(false)}
      footer={null}
      width={500}
    >
      <Form
        {...formItemLayout}
        form={form1}
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{ maxWidth: 1000 }}
        onFinish={updateKichThuoc}
      >
        <Form.Item
          name="ten"
          label="Tên: "
          hasFeedback
          rules={[{ required: true, validator: validateDateKichThuocUpdate }]}
        >
          <Input
            className="border"
            maxLength={31}
            value={ktUpdate?.ten}
            onChange={(e) => setKtUpdate({ ...ktUpdate, ten: e.target.value })}
          />
        </Form.Item>

        <Form.Item name="trangThai" label="Trạng thái: ">
          <Radio.Group
            value={ktUpdate?.trangThai}
            onChange={(e) =>
              setKtUpdate({ ...ktUpdate, trangThai: e.target.value })
            }
          >
            <Radio value={0}>Còn bán</Radio>
            <Radio value={1}>Dừng bán</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="text-end">
          <Button onClick={() => setOpenUpdate(false)} className="me-2">
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Sửa
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
