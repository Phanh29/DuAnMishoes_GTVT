import React from "react";
import { Modal, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateChatLieu({
  openUpdate,
  setOpenUpdate,
  form1,
  clUpdate,
  setClUpdate,
  tenCheck,            
  chatLieu,            
  loadChatLieu,        
  norm,                
  componentSize,
  onFormLayoutChange,
  formItemLayout,
}) {

  const validateDateChatLieuUpdate = () => {
    const tenTim = form1.getFieldValue("ten");
    if (tenTim === undefined || !tenTim.trim()) {
      return Promise.reject("Tên không được để trống");
    }
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(tenTim)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }
    if (tenTim.trim().length > 30) {
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    }
    return Promise.resolve();
  };


  const updateChatLieu = () => {
    if (clUpdate.ten !== tenCheck) {
      const checkTrung = (ten) => chatLieu.some((x) => norm(x.ten) === norm(ten));
      if (checkTrung(clUpdate.ten)) {
        toast.error("Chất liệu trùng với chất liệu khác !", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        return;
      }
    }
    ThuocTinhAPI.update("chat-lieu", clUpdate.id, clUpdate)
      .then(() => {
        toast.success("Sửa thành công!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        setClUpdate("");
        loadChatLieu();
        setOpenUpdate(false);
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      });
  };

  return (
    <Modal
      title="Sửa Chất Liệu"
      centered
      open={openUpdate}
      onCancel={() => setOpenUpdate(false)}
      onOk={() => form1.submit()}
      okText="Sửa"
      cancelText="Hủy"
      width={500}
    >
      <Form
        {...formItemLayout}
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{ maxWidth: 1000 }}
        onFinish={updateChatLieu}
        form={form1}
      >
        <Form.Item
          name="ten"
          label= "Tên: "
          hasFeedback
          rules={[{ required: true, validator: validateDateChatLieuUpdate }]}
        >
          <Input
            className="border"
            maxLength={31}
            value={clUpdate?.ten}
            onChange={(e) => setClUpdate({ ...clUpdate, ten: e.target.value })}
          />
        </Form.Item>

        <Form.Item name="trangThai" label="Trạng thái: ">
          <Radio.Group
            onChange={(e) =>
              setClUpdate({ ...clUpdate, trangThai: e.target.value })
            }
            value={clUpdate?.trangThai}
          >
            <Radio value={0}>Còn bán</Radio>
            <Radio value={1}>Dừng bán</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}