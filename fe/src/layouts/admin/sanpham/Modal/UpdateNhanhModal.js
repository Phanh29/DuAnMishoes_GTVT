import React from "react";
import { Modal, Button, Form, Input, InputNumber } from "antd";

export default function UpdateNhanhModal({
  open,
  onClose,
  form,
  updateNhanh,
  componentSize,
  onFormLayoutChange,
  formItemLayout,
}) {
  return (
    <Modal
      title="Sửa nhanh số lượng & giá bán"
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
              content: "Bạn có chắc chắn muốn sửa số lượng & giá không?",
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
          Sửa
        </Button>,
      ]}
      width={500}
    >
      <Form
        {...formItemLayout}
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{ maxWidth: 1000 }}
        onFinish={updateNhanh}
        form={form}
      >
        <Form.Item
          name="soLuong"
          label={<b>Số lượng</b>}
          hasFeedback
          rules={[{ required: true, message: "Vui lòng không để trống số lượng !" }]}
        >
          <Input className="border" />
        </Form.Item>

        <Form.Item
          name="giaBan"
          label={<b>Giá bán</b>}
          hasFeedback
          rules={[{ required: true, message: "Vui lòng không để trống giá bán !" }]}
        >
          <InputNumber
            className="border"
            style={{ width: 376 }}
            defaultValue={0}
            formatter={(value) =>
              `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
