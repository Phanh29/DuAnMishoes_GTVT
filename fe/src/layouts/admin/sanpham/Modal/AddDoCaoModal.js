import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function AddDoCaoModal({
  open,
  onClose,
  form,
  componentSize,
  onFormLayoutChange,
  dc,      // danh sách đế giày hiện có để check trùng
  loadDC,  // hàm reload danh sách đế giày
}) {
  // validate cho field Tên
  const validateDeGiay = (_, value) => {
    const tenDeGiay = form.getFieldValue("ten");

    if (!tenDeGiay || !tenDeGiay.trim()) {
      return Promise.reject("Tên không được để trống");
    }

    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(tenDeGiay)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }

    const deGiay = parseInt(value);
    if (isNaN(deGiay) || deGiay < 1 || deGiay > 10) {
      return Promise.reject("Đế giày phải là số nguyên từ 1 đến 10");
    }

    return Promise.resolve();
  };

  // thêm đế giày mới
  const addDoCao = (value) => {
    const checkTrung = (code) => {
      return dc.some(
        (x) => x.ten.trim().toLowerCase() === code.trim().toLowerCase()
      );
    };

    if (!checkTrung(value.ten)) {
      ThuocTinhAPI.create("de-giay", value)
        .then(() => {
          form.resetFields();
          onClose();
          loadDC();
          toast.success("Thêm thành công!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((error) => console.error("Error adding item:", error));
    } else {
      toast.error("Đế giày đã tồn tại !", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <Modal
      title="Thêm Độ Cao (Đế giày)"
      centered
      open={open}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            Modal.confirm({
              centered: true,
              title: "Thông báo",
              content: "Bạn có chắc chắn muốn thêm không?",
              onOk: () => {
                form.submit();
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
          Thêm
        </Button>,
      ]}
      width={500}
    >
      <Form
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{ maxWidth: 1000 }}
        onFinish={addDoCao}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="ten"
          hasFeedback
          rules={[{ validator: validateDeGiay }]}
        >
          <Input type="number" className="border" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
