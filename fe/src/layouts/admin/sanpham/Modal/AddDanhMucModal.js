import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function AddDanhMucModal({
  open,
  onClose,
  form,
  componentSize,
  onFormLayoutChange,
  dm,      // danh sách danh mục hiện có
  loadDM,  // hàm reload danh mục
}) {
  const addDanhMuc = (value) => {
    const checkTrung = (code) => {
      return dm.some(
        (x) => x.ten.trim().toLowerCase() === code.trim().toLowerCase()
      );
    };

    if (!checkTrung(value.ten)) {
      ThuocTinhAPI.create("danh-muc", value)
        .then(() => {
          form.resetFields();
          onClose();
          loadDM();
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
      toast.error("Danh mục đã tồn tại !", {
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
      title="Thêm Danh Mục"
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
        onFinish={addDanhMuc}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="ten"
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng không để trống tên!" },
          ]}
        >
          <Input className="border" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
