import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function AddChatLieuModal({
  open,
  onClose,
  form,
  componentSize,
  onFormLayoutChange,
  cl,      // danh sách chất liệu hiện có (để check trùng)
  loadCL,  // hàm reload chất liệu
}) {
  const addChatLieu = (value) => {
    const checkTrung = (code) => {
      return cl.some(
        (x) => x.ten.trim().toLowerCase() === code.trim().toLowerCase()
      );
    };

    if (!checkTrung(value.ten)) {
      ThuocTinhAPI.create("chat-lieu", value)
        .then(() => {
          form.resetFields();
          onClose();
          loadCL();
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
      toast.error("Chất liệu đã tồn tại !", {
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
      title="Thêm Chất Liệu"
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
        onFinish={addChatLieu}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="ten"
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng không để trống tên chất liệu!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const s = String(value).trim();
                if (!s) return Promise.reject("Tên không hợp lệ!");
                const special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
                if (special.test(s)) return Promise.reject("Tên không được chứa ký tự đặc biệt");
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input className="border" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
