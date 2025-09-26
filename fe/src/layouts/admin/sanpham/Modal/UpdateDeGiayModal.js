// src/components/thuoc-tinh/de-giay/UpdateDeGiay.js
import React from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateDeGiay({
  openUpdate,
  setOpenUpdate,
  form1,
  dgUpdate,
  setDgUpdate,
  tenCheck,          
  deGiay,            
  loadDeGiay,      
  norm,             
  componentSize,
  onFormLayoutChange,
  formItemLayout,
}) {

  const validateDateUpdate = (_, value) => {
    const tenTim = form1.getFieldValue("ten");
    if (tenTim == null || !tenTim.trim())
      return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(tenTim))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    const k = parseInt(value, 10);
    if (isNaN(k) || k < 1 || k > 10)
      return Promise.reject("Đế giày phải là số nguyên từ 1 đến 10");
    return Promise.resolve();
  };


  const updateDeGiay = () => {
    if (dgUpdate.ten !== tenCheck) {
      const exists = deGiay.some((x) => norm(x.ten) === norm(dgUpdate.ten));
      if (exists) {
        toast.error("❌ Đế giày trùng với đế giày khác !");
        return;
      }
    }
    ThuocTinhAPI.update("de-giay", dgUpdate.id, dgUpdate)
      .then(() => {
        toast.success("Sửa thành công!");
        setDgUpdate("");
        loadDeGiay();
        setOpenUpdate(false);
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật!");
      });
  };

  return (
    <Modal
      title="Sửa Đế Giày"
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
        onFinish={updateDeGiay}
      >
        <Form.Item
          name="ten"
          label="Tên: "
          hasFeedback
          rules={[{ required: true, validator: validateDateUpdate }]}
        >
          <Input
            className="border"
            maxLength={31}
            value={dgUpdate?.ten}
            onChange={(e) => setDgUpdate({ ...dgUpdate, ten: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Trạng thái: ">
          <Radio.Group
            value={dgUpdate?.trangThai}
            onChange={(e) =>
              setDgUpdate({ ...dgUpdate, trangThai: e.target.value })
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
