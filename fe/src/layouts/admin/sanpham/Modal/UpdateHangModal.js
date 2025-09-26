import React from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateHang({
  openUpdate,
  setOpenUpdate,
  form1,
  hangUpdate,
  setHangUpdate,
  tenCheck,       
  hang,           
  loadHang,       
  norm,          
  componentSize,
  onFormLayoutChange,
  formItemLayout,
}) {

  const validateDateHangUpdate = () => {
    const ten = (form1.getFieldValue("ten") || "").trim();
    if (!ten) return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(ten))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    if (ten.length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };


  const updateHang = () => {
    if (hangUpdate.ten !== tenCheck) {
      const exists = hang.some((x) => norm(x.ten) === norm(hangUpdate.ten || ""));
      if (exists) {
        toast.error("Hãng trùng với hãng khác!", { autoClose: 3000, theme: "light" });
        return;
      }
    }
    ThuocTinhAPI.update("hang", hangUpdate.id, hangUpdate)
      .then(() => {
        toast.success("Sửa thành công!", { autoClose: 3000, theme: "light" });
        setHangUpdate("");
        loadHang();
        setOpenUpdate(false);
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật!", { autoClose: 3000, theme: "light" });
      });
  };

  return (
    <Modal
      title="Sửa hãng"
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
        onFinish={updateHang}
      >
        <Form.Item
          name="ten"
          label="Tên: "
          hasFeedback
          rules={[{ required: true, validator: validateDateHangUpdate }]}
        >
          <Input
            className="border"
            maxLength={31}
            value={hangUpdate?.ten}
            onChange={(e) => setHangUpdate({ ...hangUpdate, ten: e.target.value })}
          />
        </Form.Item>

        <Form.Item name="trangThai" label="Trạng thái: ">
          <Radio.Group
            value={hangUpdate?.trangThai}
            onChange={(e) => setHangUpdate({ ...hangUpdate, trangThai: e.target.value })}
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
