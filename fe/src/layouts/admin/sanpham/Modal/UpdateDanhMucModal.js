// src/components/thuoc-tinh/danh-muc/UpdateDanhMuc.js
import React from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateDanhMuc({
  openUpdate,
  setOpenUpdate,
  form1,
  dmUpdate,
  setDmUpdate,
  tenCheck,         
  danhMuc,          
  loadDanhMuc,  
  norm,            
  formItemLayout,    
}) {

  const validateDateUpdate = () => {
    const tenTim = form1.getFieldValue("ten");
    if (!tenTim || !tenTim.trim())
      return Promise.reject("Tên không được để trống");
    if (/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/.test(tenTim))
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    if (tenTim.trim().length > 30)
      return Promise.reject("Tên không được vượt quá 30 ký tự");
    return Promise.resolve();
  };


  const updateDanhMuc = () => {
    if (dmUpdate.ten !== tenCheck) {
      const checkTrung = (ten) => danhMuc.some((dm) => norm(dm.ten) === norm(ten));
      if (checkTrung(dmUpdate.ten)) {
        toast.error("Danh mục trùng với danh mục khác !", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        return;
      }
    }
    ThuocTinhAPI.update("danh-muc", dmUpdate.id, dmUpdate)
      .then(() => {
        toast.success("Sửa thành công!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
        setDmUpdate("");
        loadDanhMuc();
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
      title="Sửa Danh Mục"
      centered
      open={openUpdate}
      onCancel={() => setOpenUpdate(false)}
      footer={null}
      width={500}
    >
      <Form form={form1} {...formItemLayout} onFinish={updateDanhMuc}>
        <Form.Item
          name="ten"
          label="Tên: "
          hasFeedback
          rules={[{ required: true, validator: validateDateUpdate }]}
        >
          <Input
            maxLength={31}
            className="border"
            value={dmUpdate.ten}
            onChange={(e) => setDmUpdate({ ...dmUpdate, ten: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Trạng thái: ">
          <Radio.Group
            value={dmUpdate.trangThai}
            onChange={(e) =>
              setDmUpdate({ ...dmUpdate, trangThai: e.target.value })
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
