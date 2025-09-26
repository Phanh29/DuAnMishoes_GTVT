import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function AddKichThuocModal({
  open,
  onClose,
  form,
  componentSize,
  onFormLayoutChange,
  ktData,
  loadKT
}) {
  // Hàm validate để truyền thẳng vào rules
  const validateKichThuoc = (_, value) => {
    const tenKichThuoc = form.getFieldValue("ten");

    if (!tenKichThuoc || !tenKichThuoc.trim()) {
      return Promise.reject("Tên không được để trống");
    }

    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(tenKichThuoc)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }

    const kichThuoc = parseInt(value);
    if (isNaN(kichThuoc) || kichThuoc < 34 || kichThuoc > 47) {
      return Promise.reject("Đế giày phải là số nguyên từ 34 đến 47");
    }

    return Promise.resolve();
  };

  // Hàm thêm kích thước
  const addKichThuoc = (value) => {
    const checkTrung = (code) => {
      return ktData.some(
        (x) => x.ten.trim().toLowerCase() === code.trim().toLowerCase()
      );
    };

    if (!checkTrung(value.ten)) {
      ThuocTinhAPI.create("kich-thuoc", value)
        .then(() => {
          form.resetFields();
          onClose();
          loadKT();
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
      toast.error("Kích thước đã tồn tại !", {
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
      title="Thêm Kích Thước"
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
              centered: "centered",
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
        onFinish={addKichThuoc}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="ten"
          hasFeedback
          rules={[{ validator: validateKichThuoc }]}
        >
          <Input type="number" className="border" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
